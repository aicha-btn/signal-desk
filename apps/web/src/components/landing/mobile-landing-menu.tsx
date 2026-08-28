"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";

const links = [
  { label: "Product", href: "#product" },
  { label: "Method", href: "#method" },
  { label: "Teams", href: "#teams" },
  { label: "FAQ", href: "#faq" },
] as const;

export function MobileLandingMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <a
        className="flex min-h-11 items-center justify-center gap-2 border-2 border-[var(--ink-950)] bg-[var(--ink-950)] px-3 text-sm font-bold text-[var(--paper-0)]"
        href={isAuthenticated ? "/control-room" : "/login"}
      >
        {isAuthenticated ? <ArrowRight aria-hidden="true" size={17} /> : <LogIn aria-hidden="true" size={17} />}
        <span>{isAuthenticated ? "Open" : "Sign in"}</span>
      </a>
      <button
        type="button"
        className="flex size-11 items-center justify-center border-2 border-[var(--ink-950)] bg-[var(--paper-0)]"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-landing-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      {open && (
        <div
          id="mobile-landing-navigation"
          className="absolute top-full right-0 left-0 border-y-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-3 shadow-[0_8px_0_rgb(18_18_18/0.12)]"
        >
          <nav className="grid grid-cols-2 border-t-2 border-l-2 border-[var(--ink-950)]" aria-label="Mobile main navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-12 items-center justify-between border-r-2 border-b-2 border-[var(--ink-950)] px-3 text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            ))}
          </nav>
          <a
            href="#early-access"
            className="mt-3 flex min-h-12 items-center justify-between bg-[var(--cobalt-500)] px-4 font-bold text-[var(--paper-0)]"
            onClick={() => setOpen(false)}
          >
            Get early access
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      )}
    </div>
  );
}
