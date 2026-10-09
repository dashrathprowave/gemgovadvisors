# CI/CD — PC se VPS tak poora process (copy-paste runbook)

> Ye file repo me commit hoti hai (repo **private** hai). **Private key yahan kabhi mat likhna.**

---

## Pipeline ka flow — push karne par kya hota hai

```
git push (master)
   │
   ▼
GitHub Actions — TEST jobs (frontend + backend, parallel me)
   frontend: npm ci → eslint → unit tests → next build → smoke test
   backend:  syntax check → pip install (CPU torch) → FastAPI app import check
   │
   ├─ koi step fail → deploy NAHI hota, Actions red ❌, GitHub email
   │
   ▼ (sab pass)
DEPLOY job (sirf master/tag push par, PR par nahi)
   git pull → frontend: npm ci → build → pm2 restart
            → backend: venv refresh → pm2 restart → /health check (10 min tak retry)
   │
   ├─ backend healthy nahi → job red ❌ (pm2 logs chatbot-backend dekho)
   └─ sab green ✅ — site + chatbot API dono live hain
```

---

## Step 0 — Ek baar ki setup: DONE ✅ (dubara nahi karna)

- [x] GitHub repo `dashrathprowave/gemgovadvisors` (branch `master`)
- [x] Laptop SSH key `C:\Users\Dashrath\.ssh\id_ed25519` — public key VPS me (root + test_gem1 dono ke `authorized_keys`)
- [x] Passwordless SSH verified: `CONNECTED` / `test_gem1`
- [x] GitHub Secrets (6): `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_PATH`, `SITE_URL`, `VPS_SSH_KEY`
- [x] DNS: `gemgovadvisors.com`, `www`, `test.gemgovadvisors.com` → `198.38.81.141` ✅
- [x] **Testing phase**: site abhi `test.gemgovadvisors.com` par hai — production shift ka checklist Step 11 me hai

**Secret values ki reference table** (GitHub me already daali hain — dobara mat daalna):

| Secret | Value |
| --- | --- |
| `VPS_HOST` | `198.38.81.141` |
| `VPS_USER` | `test_gem1` |
| `VPS_PORT` | `22` |
| `VPS_PATH` | `/var/www/43faa5e9-7cd2-4812-98bd-e2844e516dfe/public_html` |
| `SITE_URL` | `https://test.gemgovadvisors.com` ← **testing domain**; production shift par badalna hai (Step 11) |
| `VPS_SSH_KEY` | laptop ki private key (`Get-Content "$env:USERPROFILE\.ssh\id_ed25519"`) — **sirf GitHub secret me** |

---

## Step 1 — Files (assistant banata hai — aapko kuch nahi chalana)

| File | Kaam |
| --- | --- |
| `tests/*.test.mjs` (4 files) | Unit tests — seo, site data, submissions fallback, env loader |
| `tests/setup-alias.mjs` + `tests/alias-loader.mjs` | `@/` imports ko plain Node me chalane ka hook |
| `scripts/smoke.mjs` | Production server chala ke routes check karta hai |
| `scripts/changelog.mjs` | Git log se `CHANGELOG.md` banata hai |
| `.github/workflows/ci.yml` | Poora pipeline — test + deploy |
| `package.json` | `test`, `smoke`, `changelog` scripts |
| `src/lib/submissions.js` | `DATA_DIR` env override (tests ke liye) |

---

## Step 2 — PC par verify (PowerShell, project folder)

```powershell
cd "D:\Prowave\One Page Site\GeMGovAdvisor\frontend"
npm run lint
npm test
npm run build
npm run smoke
```

Expected: charo green. Smoke me `All 12 smoke checks passed.`

Backend check (Python venv ke saath):

```powershell
cd "D:\Prowave\One Page Site\GeMGovAdvisor\backend"
..\venv\Scripts\python.exe -m compileall -q api db rag ingestion tenders analytics scripts config.py main.py models.py
..\venv\Scripts\python.exe -c "from main import app; print('routes:', len(app.routes))"
```

---

## Step 3 — Commit + push

```powershell
git add -A
git commit -m "ci: add tests, smoke check and CD pipeline to VPS"
git push
```

---

## Step 4 — GitHub Actions me dekho

Repo → **Actions** tab → pehla run (`CI/CD`):

- **test job**: `frontend/` me `npm ci` → lint → test → build → smoke → bundle — sab green ✅
- **test-backend job**: `backend/` me syntax check → pip install → FastAPI import check — green ✅
- **deploy job**: git pull → frontend build + pm2 restart → backend venv refresh + pm2 restart → backend `/health` check
  - ⚠️ **Pehli baar backend health check FAIL ho sakta hai — EXPECTED hai.** Pehli boot par ~3 GB ke ML models download hote hain (10+ min). Dobara deploy par cache hota hai, fast hai.

---

## Step 5 — PEHLI DEPLOY: VPS ki one-time setup (sirf ek baar)

### 5.1 🖥️ SSH — files check karo

```powershell
ssh test_gem1@198.38.81.141
cd /var/www/43faa5e9-7cd2-4812-98bd-e2844e516dfe/public_html
ls -la
```

`start.js`, `server.js`, `.next`, `scripts/`, `db/` dikhne chahiye (CI ne upload kiye).

### 5.2 🖥️ `.env.local` banao (usi folder me)

```bash
nano .env.local
```

Ye paste karo aur passwords Enhance panel (**Databases** section) se bharo:

```bash
# Enhance MySQL unix socket par chalta hai
MYSQL_SOCKET=/run/mysqld/mysqld.sock
MYSQL_USER=<Enhance database user>
MYSQL_PASSWORD=<Enhance database password>
MYSQL_DATABASE=<Enhance database name>

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=gem@gemgovadvisors.com
SMTP_PASSWORD=<mailbox password>

HOSTNAME=0.0.0.0
```

Rules: **`HOSTNAME=0.0.0.0` zaroori** (warna 502), **`PORT mat likho** (panel khud deta hai).

### 5.3 🖥️ Database tables

```bash
node -v                          # v20+ chahiye
node scripts/db-setup.mjs        # tables banega — safe to re-run
node scripts/db-check.mjs        # last line: Email alerts: SMTP (...) — OFF nahi
node scripts/mail-test.mjs       # ek real test email jayega
```

### 5.4 🌐 Enhance panel (browser): app start karo

Website → `gemgovadvisors.com` → **Deploy Node.js** tool:

| Field | Value |
| --- | --- |
| Application root | `/var/www/43faa5e9-7cd2-4812-98bd-e2844e516dfe/public_html` |
| Startup file | **`start.js`** ← NOT server.js |
| Node version | 20+ |

Aur **SSL on** karo (Let's Encrypt) — domain `test.gemgovadvisors.com`.

App start hone par log line chahiye:

```
[start] env vars loaded: 9 | database: configured | email: configured
```

`MISSING` dikhe → `.env.local` sahi folder me nahi hai.

### 5.5 🔁 Deploy job re-run karo

GitHub → Actions → pehla run → **Re-run failed jobs**
(ya ek empty push: `git commit --allow-empty -m "chore: re-run deploy"` → `git push`)

→ deploy job **GREEN** ✅

---

## Step 6 — Live verify

1. `https://test.gemgovadvisors.com` khulo — styling/images load ho rahe hon
2. `/register` form submit → success page
3. Row check: `node scripts/db-check.mjs` (VPS par)
4. Email check: `gem@gemgovadvisors.com` inbox

---

## Step 7 — Roz ka kaam (normal change) — sirf 3 commands

```powershell
git add -A
git commit -m "feat: <kya badla>"    # fix:/docs:/chore: prefixes
git push
```

Baaki pipeline khud: test → deploy → health check. **Aap kuch aur nahi karte.**

| Situation | Action |
| --- | --- |
| Bada feature, pehle test | branch banao → push → PR → sirf test chalega → merge → deploy |
| Galat code live chala | `git revert <hash>` → push → purana build live |

---

## Step 8 — Version / release (optional)

```powershell
npm version minor          #0.1.0 → 0.2.0 + auto tag v0.2.0
git push && git push --tags
npm run changelog
git add CHANGELOG.md
git commit -m "docs: changelog for v0.2.0"
git push
```

`patch` = sirf fix, `major` = breaking change.

---

## Step 9 — Rollback (site bigad jaye to)

```powershell
git log --oneline           # wala commit dekho jo bigadne wala tha
git revert <hash>
git push                    # pipeline purana build deploy kar degi
```

VPS par har deploy se pehle backup bhi banta hai (`.next-prev`):

```bash
# Sirf files se wapas jaana ho (bina git ke):
cd /var/www/43faa5e9-7cd2-4812-98bd-e2844e516dfe/public_html
rm -rf .next && mv .next-prev .next
# phir panel se Restart
```

---

## Step 10 — SSH quick reference

```powershell
# Laptop se VPS
ssh test_gem1@198.38.81.141

# Permission nahi mil rahi (key check)
ssh -o BatchMode=yes -o IdentitiesOnly=yes test_gem1@198.38.81.141 "echo CONNECTED && whoami"
```

Manual fallback (CI zinda hai to zaroorat nahi): `npm run bundle` → `scp deploy.tar.gz ...` → VPS par extract → **panel Restart button**.

---

## Step 11 — Baad me production `gemgovadvisors.com` par shift (checklist)

Testing phase me `SITE_URL` test domain par hai. Production switch par **sirf ye badlega — code ka0 changes:**

- [ ] **Panel**: nayi site `gemgovadvisors.com` (+ SSL) → nayi directory `/var/www/<naya-id>/public_html`
- [ ] GitHub secret **`VPS_PATH`** → nayi directory ka path
- [ ] GitHub secret **`SITE_URL`** → `https://gemgovadvisors.com`
- [ ] Us nayi site par Step 5 jaisa ek baar: `start.js` config + `.env.local` + DB
- [ ] Deploy re-run → green

> `src/data/site.js` ka `SITE.url` pehle se production (`https://www.gemgovadvisors.com`) hai — isliye **test site ke canonical/sitemap/structured data intentionally production dikhate hain** (duplicate-content se bachne ke liye). Ye expected hai.

---

## Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| Deploy job: `Permission denied (publickey)` | Public key VPS ke `authorized_keys` me nahi hai (test_gem1 ka `~/.ssh/authorized_keys` check) |
| Deploy job: `Host key verification failed` | `ssh-keyscan` step fail — VPS_PORT/HOST secrets check |
| Health check fail (setup ke baad) | App chalu hai? `.env.local` ki `[start]` log line, `HOSTNAME=0.0.0.0`, SSL on? |
| Lint/test step red | Wahi command locally chalao (`npm test`) — error dikhega |
| Site par CSS nahi (layout bigda) | Mixed builds — `.next-prev` wala rollback karo, re-run |
| Form submit nahi | `MYSQL_*` wrong — `node scripts/db-check.mjs`; row `data/` me milegi |
| Deploy job SKIP dikhe | Push `master` par hua? PR sirf test karta hai |

---

## Commands cheat-sheet (sirf ye yaad rakho)

```powershell
# Normal change
git add -A && git commit -m "feat: ..." && git push

# Release
npm version minor && git push --git... (git push && git push --tags)

# Local check
npm run lint; npm test; npm run build; npm run smoke
```
