"use client";

import { scrollToSection } from "@/lib/scroll-to-section";

const NAV_LINKS = [
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter uppercase">Monolog</span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
        {NAV_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(event) => scrollToSection(event, item.href)}
            className="group relative overflow-hidden"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {item.label}
            </span>
            <span className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
