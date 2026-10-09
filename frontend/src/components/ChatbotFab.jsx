"use client";

import { useState, useEffect } from "react";
import ChatWidget from "./ChatWidget";
import { SITE } from "@/data/site";
import "./ChatbotFab.css";

const GREETING =
  "Namaste! 🙏 Welcome to " +
  SITE.name +
  " by " +
  SITE.legalName +
  ".\nI'm your GeM & Government Tender assistant.\nHow can I help you today?";

/**
 * Floating AI chat launcher, pinned bottom-right on every page.
 *
 * A 💬 button sits just above the WhatsApp button; clicking it pops
 * the chat panel open. The ChatWidget only mounts after the first
 * click, so its localStorage/sessionStorage use never runs during
 * server rendering — no hydration mismatches.
 */
export default function ChatbotFab() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`chatbot-fab${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        title="Chat with us"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Chat assistant">
          <ChatWidget title={SITE.name} greeting={GREETING} />
        </div>
      )}
    </>
  );
}
