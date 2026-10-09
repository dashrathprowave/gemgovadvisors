"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatbotFab from "@/components/ChatbotFab";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * Site chrome (header / footer / floating buttons) for every page
 * EXCEPT /admin — the admin panel brings its own dashboard shell
 * (sidebar + topbar) and must render without any site chrome.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-secondary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatbotFab />
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
    </>
  );
}
