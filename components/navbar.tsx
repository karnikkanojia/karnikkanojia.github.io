"use client";

import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

import { useSoundEffects } from "@/components/sound-effects-provider";
import { scrollToSection } from "@/lib/scroll-to-section";

const DESKTOP_LINKS = [
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
];

const MOBILE_LINKS = [
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
];

const CONTACT_LABEL = "Contact Me";

const MOTION_TRANSITION = {
  duration: 0.22,
  ease: [0.23, 1, 0.32, 1],
} as const;

const ICON_TRANSITION = {
  duration: 0.16,
  ease: [0.23, 1, 0.32, 1],
} as const;

type SlidePhase = "idle" | "active" | "exiting";

type AnchorClickEvent = MouseEvent<HTMLAnchorElement>;

function navigateToSection(
  event: AnchorClickEvent,
  href: string,
  onNavigate?: () => void
) {
  scrollToSection(event, href);
  onNavigate?.();
}

type NavLinkProps = {
  href: string;
  label: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

type UnderlineButtonProps = {
  children: ReactNode;
  onClick: () => void;
  ariaExpanded?: boolean;
  ariaLabel?: string;
};

function UnderlineButton({
  children,
  onClick,
  ariaExpanded,
  ariaLabel,
}: UnderlineButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      className="relative inline-flex items-center py-1 text-sm font-medium leading-none tracking-tight text-white outline-none transition-transform duration-150 ease-out active:scale-95"
    >
      <span className="relative block overflow-hidden pb-0.5">
        <span>{children}</span>
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-current"
          initial={false}
          animate={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
          transition={MOTION_TRANSITION}
        />
      </span>
    </motion.button>
  );
}

function NavLink({
  href,
  label,
  variant = "desktop",
  onNavigate,
}: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);
  const [slidePhase, setSlidePhase] = useState<SlidePhase>("idle");

  const activate = () => {
    setIsActive(true);
    setSlidePhase("active");
  };

  const deactivate = () => {
    setIsActive(false);
    setSlidePhase("exiting");
  };

  const handleAnimationComplete = () => {
    if (slidePhase === "exiting") {
      setSlidePhase("idle");
    }
  };

  if (variant === "mobile") {
    return (
      <motion.a
        href={href}
        onClick={(event) => navigateToSection(event, href, onNavigate)}
        onHoverStart={activate}
        onHoverEnd={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="group relative flex w-full items-center overflow-hidden border-t border-white/10 py-3 pr-14 text-left text-5xl font-medium leading-none tracking-tighter text-white outline-none last:border-b focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-6xl"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 bg-[#f5f5f5]"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={MOTION_TRANSITION}
        />
        <motion.span
          className="relative z-10 block"
          initial={false}
          animate={{
            transform: isActive
              ? "translate3d(6px, 0.04em, 0)"
              : "translate3d(0px, 0.04em, 0)",
            color: isActive ? "#000000" : "rgba(255,255,255,1)",
          }}
          transition={MOTION_TRANSITION}
        >
          {label}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute right-1 z-10 flex translate-y-[0.04em] items-center justify-center text-5xl sm:right-2 sm:text-6xl"
          initial={false}
          animate={{
            transform: isActive
              ? "translate3d(0px, 0.04em, 0)"
              : "translate3d(-18px, 0.04em, 0)",
            opacity: isActive ? 1 : 0,
            color: isActive ? "#000000" : "rgba(255,255,255,0)",
          }}
          transition={MOTION_TRANSITION}
        >
          {"\u2192"}
        </motion.span>
      </motion.a>
    );
  }

  const backgroundTransform =
    slidePhase === "active"
      ? "translate3d(0%, 0%, 0)"
      : slidePhase === "exiting"
        ? "translate3d(101%, 0%, 0)"
        : "translate3d(-101%, 0%, 0)";

  return (
    <motion.a
      href={href}
      onClick={(event) => navigateToSection(event, href, onNavigate)}
      onHoverStart={activate}
      onHoverEnd={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      className="group relative overflow-hidden px-3 py-2 text-sm font-light leading-none text-white"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-white"
        initial={false}
        animate={{ transform: backgroundTransform }}
        transition={
          slidePhase === "idle" ? { duration: 0 } : MOTION_TRANSITION
        }
        onAnimationComplete={handleAnimationComplete}
      />
      <span className="relative z-10 transition-colors duration-200 group-hover:text-black group-focus-visible:text-black">
        {label}
      </span>
    </motion.a>
  );
}

function SoundToggle() {
  const { isMuted, toggleMuted } = useSoundEffects();
  const Icon = isMuted ? VolumeX : Volume2;

  return (
    <button
      type="button"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      aria-pressed={isMuted}
      onClick={toggleMuted}
      className="inline-flex size-7 items-center justify-center bg-black/85 text-white transition duration-200 ease-out hover:bg-[#f5f5f5]/90 hover:text-black active:scale-95"
    >
      <motion.span
        key={isMuted ? "muted" : "sound"}
        initial={{ opacity: 0, transform: "scale(0.9)" }}
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={ICON_TRANSITION}
      >
        <Icon aria-hidden="true" className="size-3" strokeWidth={2.2} />
      </motion.span>
    </button>
  );
}

function AnimatedTextSwap({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  return (
    <span className="relative z-10 inline-grid h-4 place-items-center overflow-hidden text-black">
      <span className="invisible row-start-1 col-start-1 whitespace-nowrap">
        {label}
      </span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        initial={false}
        animate={{
          transform: isActive
            ? "translate3d(0%, -100%, 0)"
            : "translate3d(0%, 0%, 0)",
        }}
        transition={MOTION_TRANSITION}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        initial={false}
        animate={{
          transform: isActive
            ? "translate3d(0%, 0%, 0)"
            : "translate3d(0%, 100%, 0)",
        }}
        transition={MOTION_TRANSITION}
      >
        {label}
      </motion.span>
    </span>
  );
}

function AnimatedArrowSwap({ isActive }: { isActive: boolean }) {
  return (
    <span className="relative z-10 inline-flex size-5 items-center justify-center overflow-hidden bg-black text-white">
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          transform: isActive
            ? "translate3d(100%, -100%, 0)"
            : "translate3d(0%, 0%, 0)",
        }}
        transition={MOTION_TRANSITION}
      >
        <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={2.5} />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          transform: isActive
            ? "translate3d(0%, 0%, 0)"
            : "translate3d(-100%, 100%, 0)",
        }}
        transition={MOTION_TRANSITION}
      >
        <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={2.5} />
      </motion.span>
    </span>
  );
}

function ContactButton({ onNavigate }: { onNavigate?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="#contact"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={(event) => navigateToSection(event, "#contact", onNavigate)}
      className="relative inline-flex h-7 items-center gap-1.5 overflow-hidden bg-[#f5f5f5] px-2 pl-2.5 text-xs font-medium leading-none tracking-tight text-black transition-transform duration-150 ease-out active:scale-95"
    >
      <AnimatedTextSwap label={CONTACT_LABEL} isActive={isHovered} />
      <AnimatedArrowSwap isActive={isHovered} />
    </motion.a>
  );
}

function BrandLink({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href="#"
      data-no-sound
      onClick={(event) => navigateToSection(event, "#", onNavigate)}
      className={`flex items-center ${className}`}
      aria-label="Monolog home"
    >
      <img
        src="/monogram.svg"
        alt="Monolog"
        className="h-5 w-auto"
      />
    </a>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { scrollY } = useScroll();
  const closeMenu = () => setIsMenuOpen(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current;
    const delta = current - previous;

    if (isMenuOpen || current < 80) {
      setIsNavbarVisible(true);
      return;
    }

    if (delta > 8) {
      setIsNavbarVisible(false);
      return;
    }

    if (delta < -8) {
      setIsNavbarVisible(true);
    }
  });

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-black px-5 py-2 text-white md:px-6 md:py-2.5"
        initial={false}
        animate={{
          transform: isNavbarVisible
            ? "translate3d(0, 0%, 0)"
            : "translate3d(0, -110%, 0)",
        }}
        transition={MOTION_TRANSITION}
      >
        <BrandLink />

        <div className="hidden items-center gap-1 md:flex">
          {DESKTOP_LINKS.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <SoundToggle />
          <ContactButton />
          <div className="md:hidden">
            <UnderlineButton
              ariaLabel="Open navigation menu"
              ariaExpanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              Menu
            </UnderlineButton>
          </div>
        </div>
      </motion.nav>

      <div
        className={`fixed inset-0 z-50 bg-black/95 px-5 pb-10 pt-24 text-white transition duration-200 ease-out md:hidden ${
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <BrandLink className="absolute left-5 top-7" onNavigate={closeMenu} />

        <div className="absolute right-5 top-6 flex items-center gap-4">
          <SoundToggle />
          <ContactButton onNavigate={closeMenu} />
          <UnderlineButton onClick={closeMenu}>
            Close
          </UnderlineButton>
        </div>

        <div className="flex flex-col">
          {MOBILE_LINKS.map((item) => (
            <NavLink
              key={item.label}
              {...item}
              variant="mobile"
              onNavigate={closeMenu}
            />
          ))}
        </div>
      </div>
    </>
  );
}
