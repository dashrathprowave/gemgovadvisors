"use client";

import { useEffect, useSyncExternalStore } from "react";

const THEME_EVENT = "myscheme-theme-change";

function subscribe(callback) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  window.localStorage.setItem("theme", isDark ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function useDarkMode() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (prefersDark !== getSnapshot()) applyTheme(prefersDark);
  }, []);

  const toggle = () => applyTheme(!isDark);

  return [isDark, toggle];
}
