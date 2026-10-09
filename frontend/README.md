# GeM Advisor

[![CI/CD](https://github.com/dashrathprowave/gemgovadvisors/actions/workflows/ci.yml/badge.svg)](https://github.com/dashrathprowave/gemgovadvisors/actions/workflows/ci.yml)

GeM Advisor — a multi-page marketing site for a GeM and government tender
consultancy, built on Next.js 16 (App Router). The visual system is inherited
from the myscheme-clone project (`src/app/compiled-tailwind.css` is reused
as-is) and re-themed to a light-orange brand palette.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing and CI/CD

```bash
npm test        # unit tests — seo, site data, submissions fallback, env loader
npm run lint    # eslint
npm run build   # production build (27 routes)
npm run smoke   # starts the built site on :3100 and checks 12 routes
```

Every push to `master` runs lint → tests → build → smoke on GitHub Actions and,
if all pass, deploys `deploy.tar.gz` to the VPS with a health check. Pull
requests run the tests only. Releases are marked with `npm version` tags and
`npm run changelog`.

Full runbook: [CI-CD-STEPS.md](./CI-CD-STEPS.md) · Pipeline reference:
[DEPLOY.md](./DEPLOY.md)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home — hero carousel, services, process, GeM overview, industries, FAQs, enquiry form |
| `/about` | About the firm, how we work, commitments |
| `/services` | All six services; supports `?q=` filtering |
| `/services/[slug]` | One page per service (statically generated from `SERVICES`) |
| `/gem-services` | Government e-Marketplace support, document checklist, common mistakes |
| `/government-tenders` | Tender portals, six-stage bid process, eligibility checklist |
| `/industries` | Sectors served |
| `/faqs` | Full FAQ knowledge base |
| `/contact` | Contact details and message form |
| `/register` | Business registration form → `/register/success` |
| `/privacy-policy`, `/terms-and-conditions`, `/disclaimer` | Legal pages |

`sitemap.xml` and `robots.txt` are generated from `src/app/sitemap.js` and
`src/app/robots.js` — new routes must be added to the former.

## Content

All business content — services, industries, FAQs, stats, navigation,
disclaimer, contact details — lives in `src/data/site.js`. Edit it there rather
than in the components; the header, footer, sitemap and structured data all
read from it.

## Theming

The template's stylesheet drives brand colour through CSS variables
(`--bg-secondary`, `--text-primary`, …) set by theme classes such as `.green`.
`src/app/globals.css` redefines those variables — on `:root`, `.green` and
`.dark` — to the orange palette, so every `bg-secondary` / `text-primary`
utility inherited from the template renders orange.

New utility classes come from a real Tailwind v3 build (`tailwind.config.js`)
that runs with `preflight` disabled, since the compiled stylesheet already
supplies base styles. In that config the `green` and `teal` scales are aliased
to the `brand` scale so any legacy class name also lands on brand orange.

Note that `primary`/`secondary`/`tertiary`/`quaternary` must be declared as
`rgba(var(--bg-*), <alpha-value>)`. The template stores those variables as
comma-separated channel lists, which the space-separated `rgb(... / alpha)`
form cannot consume — using it produces invalid CSS and silently transparent
backgrounds.

## Forms and where submissions go

- **Enquiry form** (Contact sections) posts to `/api/lead` → `leads` table
- **Registration form** (`/register`) posts to `/api/register` → `registrations`
  table, then redirects to `/register/success`

Both go through `src/lib/submissions.js`, which handles a submission in three
layers:

1. **MySQL insert** — the record of truth.
2. **File fallback** — if (and only if) the database refuses the row, the
   submission is appended to a newline-delimited JSON file under `data/`, so a
   lead is never lost to a database outage.
3. **Email alert** — sent from the site's own mailbox over SMTP (`src/lib/mailer.js`)
   when the `SMTP_*` variables are set.

The visitor sees an error only if every layer failed.

## Database setup (MySQL / MariaDB)

### On the VPS, once

```sql
CREATE DATABASE gemadvisor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gemadvisor'@'localhost' IDENTIFIED BY 'a-long-random-password';
GRANT ALL PRIVILEGES ON gemadvisor.* TO 'gemadvisor'@'localhost';
FLUSH PRIVILEGES;
```

Then copy `.env.example` to `.env.local`, fill in the `MYSQL_*` values, and:

```bash
npm run db:setup    # creates the tables (safe to re-run)
npm run db:check    # confirms the connection and shows row counts
```

### Day-to-day

```bash
npm run db:check    # how many enquiries are stored, and when the last one came
npm run db:export   # writes exports/registrations-YYYY-MM-DD.csv (opens in Excel)
```

The schema lives in `db/schema.sql`. Both tables carry a `status` column
(defaults to `'new'`) and a `notes` column so the team can track who has been
followed up with, either through phpMyAdmin or a future admin page.

The `registrations` table mirrors the registration form exactly — name,
designation, mobile, email and company. Earlier versions also collected
business-detail fields (GST, Udyam, turnover, city, state, products, GeM status
and interests); those columns were dropped from live databases by
`db/migrations/001-trim-registrations.sql`, and bringing the fields back would
need both the form and a new migration.

### A note on hosting

Storing submissions in a file only works because the site runs on a VPS with a
real disk. On serverless hosting (Vercel, Netlify) the filesystem is ephemeral
and the `data/` fallback would be silently discarded — there, the database and
the email alert are the only durable copies.

## What is still a placeholder

- The three hero banner images under `public/assets/` are green-branded
  artwork from the previous theme and do not match the orange palette.
- `STATS` in `src/data/site.js` ("500+ businesses assisted") are the figures
  inherited from the original project — confirm they are accurate.
- `SITE.address.street` in `src/data/site.js` is still the literal placeholder
  "Office Address Line 1". It feeds the organisation structured data, so the
  real registered office address must be filled in before launch.
