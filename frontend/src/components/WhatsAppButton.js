import { WhatsAppIcon } from "./Icons";
import { SITE } from "@/data/site";

const MESSAGE = `Hello ${SITE.name}, I would like to know more about your GeM registration and government tender services.`;

/**
 * Floating WhatsApp contact button, pinned bottom-right on every page.
 *
 * Sits at z-30 deliberately: the mobile menu overlay is z-40 and its drawer
 * z-50, so the button disappears behind the overlay while the menu is open
 * instead of floating on top of it.
 */
export default function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${SITE.name} on WhatsApp`}
      title="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-0 rounded-full bg-[#25D366] p-4 text-white no-underline shadow-lg transition-all duration-300 hover:gap-2 hover:bg-[#1DA851] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA851] sm:bottom-6 sm:right-6"
    >
      {/* Attention ring — decorative, so it stays out of the accessibility tree. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-1 animate-ping rounded-full bg-[#25D366] opacity-60 motion-reduce:hidden"
      />
      <WhatsAppIcon className="h-7 w-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
