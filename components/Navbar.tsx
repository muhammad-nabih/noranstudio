"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "STUDIO", href: "/campaigns" },
  { label: "WORK", href: "/#work" },
  { label: "CASES STUDIES", href: "/cases-studies" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? "bg-[#060a0a]/85 backdrop-blur-md border-b border-[rgba(142,169,148,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav className="grid grid-cols-[auto_1fr_auto] items-stretch">
        {/* Logo mark */}
        <a
          href="/"
          aria-label="Home"
          className="flex h-16 w-16 shrink-0 items-center justify-center bg-accent text-accent-foreground transition-opacity hover:opacity-90"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
              fill="currentColor"
            />
          </svg>
        </a>

        {/* Desktop links */}
        <ul className="hidden flex-1 items-stretch md:flex">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.label}
              className={`flex flex-1 items-center justify-center border-l border-[rgba(142,169,148,0.15)]`}
            >
              <a
                href={link.href}
                className="text-xs font-medium tracking-[0.2em] text-foreground/90 transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile spacer so hamburger sits at the right edge */}
        <div className="flex-1 md:hidden" />

        {/* Hamburger - hidden on desktop */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-16 w-16 shrink-0 items-center justify-center border-l border-[rgba(142,169,148,0.15)] text-foreground transition-colors hover:text-accent md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col border-t border-[rgba(142,169,148,0.15)] bg-[#060a0a]/95 backdrop-blur-md md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li
              key={link.label}
              className="border-b border-[rgba(142,169,148,0.1)]"
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 text-xs font-medium tracking-[0.2em] text-foreground/90 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}