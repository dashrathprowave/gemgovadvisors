"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDarkMode } from "./useDarkMode";
import {
  ArrowRightLongIcon,
  ChevronDownIcon,
  CloseIcon,
  HamburgerIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
  UserPlusIcon,
} from "./Icons";
import { NAV, SITE } from "@/data/site";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Phone / email block in the header. The small caption above the value lets the
 * number itself be set in a heavier weight without the row reading as clutter,
 * and the icon badge fills with brand orange on hover so the whole block behaves
 * like a button — the phone number is the highest-value action on the page for a
 * consultancy.
 */
function HeaderContact({ href, Icon, label, value }) {
  return (
    <a href={href} className="group flex items-center gap-2.5 no-underline">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-brand-400 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
        <Icon size={16} />
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </span>
        <span className="block text-sm font-bold text-darkIndigo-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {value}
        </span>
      </span>
    </a>
  );
}

function HeaderDivider() {
  return <span aria-hidden="true" className="h-9 w-px flex-shrink-0 bg-gray-200 dark:bg-gray-700" />;
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [isDark, toggleDark] = useDarkMode();

  // Route change closes whatever the previous page left open. Adjusting during
  // render (rather than in an effect) avoids a second render pass with the old
  // menu still on screen.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMenuOpen(false);
    setOpenGroup(null);
  }

  // The drawer covers the page; letting the body scroll behind it is disorienting.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinkClass = (href) =>
    `whitespace-nowrap text-sm font-semibold no-underline transition-colors ${
      isActive(pathname, href)
        ? "text-brand-600 dark:text-brand-400"
        : "text-darkIndigo-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-400"
    }`;

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-0 border-b border-solid border-gray-100 bg-white/95 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-dark/95">
        {/* Row 1 — identity, search and account actions */}
        <div className="shell">
          <div className="flex items-center justify-between gap-6 py-3">
            <Link
              href="/"
              aria-label={`${SITE.name} home`}
              className="relative block h-10 w-40 flex-shrink-0 lg:h-11 lg:w-48 dark:rounded-lg dark:bg-white"
            >
              <Image
                src="/assets/gem-advisor-logo.png"
                alt={`${SITE.name} — GeM and government tender consultancy`}
                fill
                priority
                sizes="192px"
                className="object-contain object-left dark:p-1"
              />
            </Link>

            <div className="hidden flex-shrink-0 items-center gap-4 xl:flex">
              <HeaderContact
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                Icon={PhoneIcon}
                label="Call us"
                value={SITE.phone}
              />
              <HeaderDivider />
              <HeaderContact
                href={`mailto:${SITE.email}`}
                Icon={MailIcon}
                label="Email us"
                value={SITE.email}
              />
              <HeaderDivider />
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-md bg-secondary px-4 py-2.5 text-sm font-semibold leading-none text-white no-underline transition-colors hover:bg-primary"
              >
                <UserPlusIcon size={16} /> Register
              </Link>
              {/* suppressHydrationWarning: form-filler extensions inject fdprocessedid into controls before hydration. */}
              <button
                type="button"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleDark}
                suppressHydrationWarning
                className="flex h-9 w-9 items-center justify-center rounded-md border-0 bg-darkIndigo-900 !p-0 text-white transition-colors hover:bg-darkIndigo-800"
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              {/* Below xl the full contact block does not fit, so the number
                  stays reachable as a one-tap call button. */}
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                aria-label={`Call us on ${SITE.phone}`}
                title={SITE.phone}
                className="flex h-9 items-center gap-2 rounded-md bg-brand-50 px-3 text-brand-700 no-underline transition-colors hover:bg-brand-100 dark:bg-gray-800 dark:text-brand-400"
              >
                <PhoneIcon size={16} />
                <span className="hidden text-sm font-bold sm:block">{SITE.phone}</span>
              </a>
              <Link
                href="/register"
                className="rounded-md bg-secondary px-3.5 py-2 text-sm font-semibold leading-none text-white no-underline"
              >
                Register
              </Link>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                suppressHydrationWarning
                className="border-0 bg-transparent !p-0 text-brand-600"
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 — primary navigation, wide screens only */}
        <div className="hidden border-0 border-t border-solid border-gray-100 bg-brand-50/60 dark:border-gray-800 dark:bg-[#0E1A2B] xl:block">
          <div className="shell">
            <nav aria-label="Primary">
              <ul className="m-0 flex list-none items-center gap-8 p-0">
                {NAV.map((item) =>
                  item.children ? (
                    <li key={item.href} className="group relative">
                      <Link
                        href={item.href}
                        className={`${navLinkClass(item.href)} flex items-center py-3.5`}
                      >
                        {item.label}
                        <ChevronDownIcon className="!ml-0.5 !h-4 !w-4" />
                      </Link>
                      <div className="invisible absolute left-0 top-full z-40 w-64 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        <ul className="m-0 list-none rounded-b-xl border border-solid border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-[#0E1A2B]">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block rounded-lg px-3 py-2 text-sm text-darkIndigo-700 no-underline transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link href={item.href} className={`${navLinkClass(item.href)} block py-3.5`}>
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`${menuOpen ? "block" : "hidden"} fixed inset-0 z-40 bg-black/50 xl:hidden`}
      />
      <div
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-50 h-full w-4/5 max-w-sm transform overflow-y-auto bg-white transition-transform duration-300 ease-in-out dark:bg-dark xl:hidden`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white px-4 py-3 shadow-sm dark:bg-dark">
          <Link href="/" className="relative block h-9 w-36 dark:rounded-lg dark:bg-white">
            <Image
              src="/assets/gem-advisor-logo.png"
              alt={SITE.name}
              fill
              sizes="144px"
              className="object-contain object-left dark:p-1"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            suppressHydrationWarning
            className="border-0 bg-transparent !p-0 text-brand-600"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="m-0 list-none space-y-1 p-4">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(openGroup === item.href ? null : item.href)}
                      aria-expanded={openGroup === item.href}
                      suppressHydrationWarning
                      className="flex w-full items-center justify-between border-0 bg-transparent px-0 py-2.5 text-left text-base font-semibold text-darkIndigo-700 dark:text-gray-200"
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={`transform transition-transform ${openGroup === item.href ? "rotate-180" : ""}`}
                      />
                    </button>
                    <ul
                      className={`m-0 list-none space-y-1 border-0 border-l-2 border-solid border-brand-200 pl-4 ${
                        openGroup === item.href ? "block" : "hidden"
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-2 text-sm text-darkIndigo-700 no-underline dark:text-gray-300"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-2.5 text-base font-semibold no-underline ${
                      isActive(pathname, item.href)
                        ? "text-brand-600"
                        : "text-darkIndigo-700 dark:text-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 px-4 pb-6">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 rounded-md bg-secondary px-5 py-3 text-base font-semibold leading-none text-white no-underline"
          >
            Register Your Business <ArrowRightLongIcon className="ml-1 w-4" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
            <button
              type="button"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
              suppressHydrationWarning
              className="flex h-9 w-9 items-center justify-center rounded-md border-0 bg-darkIndigo-900 !p-0 text-white"
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>

          <div className="border-0 border-t border-solid border-gray-100 pt-4 text-sm dark:border-gray-800">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 py-1 text-darkIndigo-700 no-underline dark:text-gray-300"
            >
              <PhoneIcon size={16} /> {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2 py-1 text-darkIndigo-700 no-underline dark:text-gray-300"
            >
              <MailIcon size={16} /> {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
