"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./admin.css";
import {
  IconDashboard, IconFile, IconPrompt, IconChat, IconEval,
  IconCost, IconSettings, IconLogout, IconLock, IconSpark, IconUsers,
} from "@/components/admin/icons";
import { AdminAPI, hasCredentials, clearCredentials, setCredentials } from "@/lib/admin/api";
import { StoragePanel } from "@/components/admin/StoragePanel";

const NAV = [
  { to: "/admin", label: "Overview", icon: IconDashboard, end: true },
  { to: "/admin/documents", label: "Documents", icon: IconFile },
  { to: "/admin/prompt", label: "System Prompt", icon: IconPrompt },
  { to: "/admin/conversations", label: "Conversations", icon: IconChat },
  { to: "/admin/users", label: "Users", icon: IconUsers },
  { to: "/admin/evaluations", label: "Evaluations", icon: IconEval },
  { to: "/admin/cost", label: "Cost", icon: IconCost },
  { to: "/admin/settings", label: "Settings", icon: IconSettings },
];

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 30_000 } },
  }));

  const closeNav = () => setNavOpen(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Read session credentials after mount (sessionStorage doesn't exist
    // during SSR). Async callback on purpose: external browser state being
    // synced into React, not derived render state.
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setAuthed(hasCredentials());
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, []);

  async function tryLogin() {
    if (!username.trim() || !password) {
      setError("Username and password are both required.");
      return;
    }
    setError("");
    setCheckingLogin(true);
    setCredentials(username.trim(), password);
    try {
      await AdminAPI.verify();
      setAuthed(true);
      router.push("/admin");
    } catch {
      clearCredentials();
      setError("Invalid username or password.");
    } finally {
      setCheckingLogin(false);
    }
  }

  function handleLogout() {
    clearCredentials();
    window.location.reload();
  }

  const value = {
    authed, setAuthed, checking, setChecking,
    username, setUsername, password, setPassword,
    error, setError, checkingLogin, setCheckingLogin,
    navOpen, setNavOpen, closeNav, tryLogin, handleLogout,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
    </QueryClientProvider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <div className="admin-root">
        <AdminShell>{children}</AdminShell>
      </div>
    </AdminProvider>
  );
}

function AdminShell({ children }) {
  const {
    authed, checking, username, setUsername, password, setPassword,
    error, checkingLogin, navOpen, setNavOpen, closeNav, tryLogin, handleLogout,
  } = useAdmin();
  const pathname = usePathname();

  if (checking) return null;

  if (!authed) {
    return (
      <div className="login">
        <div className="login-card">
          <div className="login-logo"><IconSpark size={26} /></div>
          <h1>GeM Advisor Admin</h1>
          <p>Enter your username and password to continue.</p>
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void tryLogin();
            }}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void tryLogin();
            }}
          />
          {error && <p className="login-error">{error}</p>}
          <button
            className="primary"
            disabled={checkingLogin}
            onClick={() => void tryLogin()}
          >
            <span className="inline">
              <IconLock size={15} /> {checkingLogin ? "Checking…" : "Unlock Dashboard"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Mobile top bar (≤920px) — opens the nav drawer */}
      <div className="mobile-topbar">
        <button
          className="hamburger"
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? "Close menu" : "Open menu"}
        >
          {navOpen ? "✕" : "☰"}
        </button>
        <span className="brand-logo"><IconSpark size={16} /></span>
        <span className="mobile-title">GeM Advisor Admin</span>
      </div>
      {navOpen && <div className="nav-backdrop" onClick={closeNav} />}
      <aside className={`sidebar${navOpen ? " open" : ""}`}>
        <div className="brand">
          <span className="brand-logo"><IconSpark size={19} /></span>
          GeM Advisor Admin
        </div>
        <nav onClick={closeNav}>
          {NAV.map(({ to, label, icon: Icon, end }) => {
            const active = end ? pathname === to : pathname === to || pathname?.startsWith(to + "/");
            return (
              <Link key={to} href={to} className={active ? "active" : ""}>
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <StoragePanel />
        <div className="sidebar-foot">
          <button
            onClick={() => {
              handleLogout();
            }}
          >
            <IconLogout size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
