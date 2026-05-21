"use client";

import { ArrowUpRight, Menu, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { useState } from "react";

import { scrollToSection } from "@/lib/scroll-to-section";
import { useSoundEffects } from "@/components/sound-effects-provider";

const DESKTOP_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

const MOBILE_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

type NavLinkProps = {
  href: string;
  label: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

function NavLink({
  href,
  label,
  variant = "desktop",
  onNavigate,
}: NavLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(event, href);
    onNavigate?.();
  };

  const isMobile = variant === "mobile";

  return (
    <a
      href={href}
      onClick={handleClick}
      className={
        isMobile
          ? "group relative block overflow-hidden border-b border-white/10 py-3 text-5xl font-medium leading-none tracking-tighter text-white sm:text-6xl"
          : "group relative overflow-hidden px-3 py-2 text-sm font-light leading-none text-white"
      }
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-black/65 transition-transform duration-200 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10">{label}</span>
    </a>
  );
}

function IconButton({ label }: { label: string }) {
  const { isMuted, toggleMuted } = useSoundEffects();
  const Icon = isMuted ? VolumeX : Volume2;

  return (
    <button
      type="button"
      aria-label={isMuted ? "Unmute sound" : label}
      aria-pressed={isMuted}
      onClick={toggleMuted}
      className="inline-flex size-8 items-center justify-center bg-black/85 text-white transition duration-200 ease-out hover:bg-white/90 hover:text-black active:scale-95"
    >
      <motion.span
        key={isMuted ? "muted" : "sound"}
        initial={{ opacity: 0, transform: "scale(0.85)" }}
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      >
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.2} />
      </motion.span>
    </button>
  );
}

function ContactButton({ onNavigate }: { onNavigate?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const transition = {
    duration: 0.22,
    ease: [0.23, 1, 0.32, 1],
  } as const;

  return (
    <a
      href="#contact"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={(event) => {
        scrollToSection(event, "#contact");
        onNavigate?.();
      }}
      className="relative inline-flex h-8 items-center gap-1.5 overflow-hidden bg-white px-2 pl-2.5 text-xs font-medium leading-none tracking-tight text-black transition-transform duration-150 ease-out active:scale-95"
    >
      <span className="relative z-10 inline-grid h-4 place-items-center overflow-hidden text-black">
        <span className="invisible row-start-1 col-start-1 whitespace-nowrap">
          Contact Me
        </span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          initial={false}
          animate={{
            transform: isHovered
              ? "translate3d(0%, -100%, 0)"
              : "translate3d(0%, 0%, 0)",
          }}
          transition={transition}
        >
          Contact Me
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          initial={false}
          animate={{
            transform: isHovered
              ? "translate3d(0%, 0%, 0)"
              : "translate3d(0%, 100%, 0)",
          }}
          transition={transition}
        >
          Contact Me
        </motion.span>
      </span>
      <span className="relative z-10 inline-flex size-5 items-center justify-center overflow-hidden bg-black text-white">
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            transform: isHovered
              ? "translate3d(100%, -100%, 0)"
              : "translate3d(0%, 0%, 0)",
          }}
          transition={transition}
        >
          <ArrowUpRight
            aria-hidden="true"
            className="size-3"
            strokeWidth={2.5}
          />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            transform: isHovered
              ? "translate3d(0%, 0%, 0)"
              : "translate3d(-100%, 100%, 0)",
          }}
          transition={transition}
        >
          <ArrowUpRight
            aria-hidden="true"
            className="size-3"
            strokeWidth={2.5}
          />
        </motion.span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5 text-white md:px-6 md:py-6">
        <a
          href="#"
          onClick={(event) => scrollToSection(event, "#")}
          className="text-xl font-bold uppercase leading-none tracking-tighter"
          aria-label="Monolog home"
        >
          Monolog
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {DESKTOP_LINKS.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <IconButton label="Toggle sound" />
          <ContactButton />
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex h-10 items-center justify-center text-sm font-medium leading-none tracking-tight text-white transition-transform duration-150 ease-out active:scale-95 md:hidden"
          >
            <Menu aria-hidden="true" className="size-7" strokeWidth={2.2} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/95 px-5 pb-10 pt-24 text-white transition duration-200 ease-out md:hidden ${
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <a
          href="#"
          onClick={(event) => {
            scrollToSection(event, "#");
            setIsMenuOpen(false);
          }}
          className="absolute left-5 top-7 text-xl font-bold uppercase leading-none tracking-tighter"
          aria-label="Monolog home"
        >
          Monolog
        </a>

        <div className="absolute right-5 top-6 flex items-center gap-4">
          <IconButton label="Toggle sound" />
          <ContactButton onNavigate={() => setIsMenuOpen(false)} />
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="h-10 text-sm font-medium leading-none tracking-tight text-white transition-transform duration-150 ease-out active:scale-95"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col">
          {MOBILE_LINKS.map((item) => (
            <NavLink
              key={item.label}
              {...item}
              variant="mobile"
              onNavigate={() => setIsMenuOpen(false)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
