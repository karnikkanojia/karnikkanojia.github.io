"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import Dither from "@/components/dither";
import { scrollToPageTop, scrollToSection } from "@/lib/scroll-to-section";

const TRANSITION = { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const };

const NAV_LINKS = [
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com/KanojiaKarnik",
  },
  {
    label: "GitHub",
    href: "https://www.github.com/karnikkanojia",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/karnikkanojia",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/karnikkanojia/",
  },
];

type FooterNavLinkProps = {
  label: string;
  href: string;
};

function FooterNavLink({ label, href }: FooterNavLinkProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.a
      href={href}
      className="group relative flex w-full items-center overflow-hidden border-t border-white/10 py-1.5 pr-14 text-left text-3xl font-medium leading-none tracking-tight text-white/84 outline-none last:border-b focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:py-2 md:text-4xl lg:text-5xl"
      onClick={(event) => scrollToSection(event, href)}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 bg-[#f5f5f5]"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={TRANSITION}
      />
      <motion.span
        className="relative z-10 block translate-y-[0.04em]"
        initial={false}
        animate={{
          x: isActive ? 6 : 0,
          color: isActive ? "#000000" : "rgba(255,255,255,0.84)",
        }}
        transition={TRANSITION}
      >
        {label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute right-1 z-10 flex translate-y-[0.04em] items-center justify-center text-3xl md:right-2 md:text-4xl lg:text-5xl"
        initial={false}
        animate={{
          x: isActive ? 0 : -18,
          opacity: isActive ? 1 : 0,
          color: isActive ? "#000000" : "rgba(255,255,255,0)",
        }}
        transition={TRANSITION}
      >
        {"\u2192"}
      </motion.span>
    </motion.a>
  );
}

type AsideLinkProps = {
  label: string;
  href: string;
};

function AsideLink({ label, href }: AsideLinkProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex w-fit items-start py-1.5 text-lg font-medium leading-none text-white/82 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <span className="relative block w-fit overflow-hidden pb-0.5">
        <motion.span className="block" initial={false} transition={TRANSITION}>
          {label}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-current"
          initial={false}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={TRANSITION}
        />
      </span>

      <span className="relative ml-1 mt-0.5 flex size-5 shrink-0 items-center justify-center overflow-hidden text-xl text-white">
        <motion.span
          aria-hidden="true"
          className="absolute"
          initial={false}
          animate={{
            x: isActive ? 12 : 0,
            y: isActive ? -12 : 0,
            opacity: isActive ? 0 : 1,
          }}
          transition={TRANSITION}
        >
          {"\u2197"}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute"
          initial={false}
          animate={{
            x: isActive ? 0 : -12,
            y: isActive ? 0 : 12,
            opacity: isActive ? 1 : 0,
          }}
          transition={TRANSITION}
        >
          {"\u2197"}
        </motion.span>
      </span>
    </motion.a>
  );
}

function BackToTopButton() {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.button
      type="button"
      className="group relative flex w-full items-center overflow-hidden py-1 pr-10 text-left text-base font-medium leading-snug tracking-tight text-white/82 outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      onClick={scrollToPageTop}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 bg-[#f5f5f5]"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={TRANSITION}
      />
      <motion.span
        className="relative z-10 block translate-y-[0.04em]"
        initial={false}
        animate={{
          x: isActive ? 4 : 0,
          color: isActive ? "#000000" : "rgba(255,255,255,0.82)",
        }}
        transition={TRANSITION}
      >
        Back to top
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute right-1 z-10 flex translate-y-[0.04em] items-center justify-center text-base md:right-2"
        initial={false}
        animate={{
          x: isActive ? 0 : -18,
          opacity: isActive ? 1 : 0,
          color: isActive ? "#000000" : "rgba(255,255,255,0)",
        }}
        transition={TRANSITION}
      >
        {"\u2191"}
      </motion.span>
    </motion.button>
  );
}

function FooterTime() {
  const [stamp, setStamp] = useState({
    time: "",
    date: "",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setStamp({
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    };

    update();
    const id = window.setInterval(update, 1000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-base font-medium leading-tight tracking-tight text-white/82">
      India {stamp.time}
      <br />
      {stamp.date} (GMT +05:30)
    </p>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-black font-medium text-white [font-family:var(--font-kh-teka)] lg:grid lg:h-screen lg:grid-rows-[5fr_1fr]"
    >
      <div className="px-3 pb-8 pt-16 md:px-4 md:pt-20 lg:flex lg:min-h-0 lg:px-6 lg:pb-6 lg:pt-16">
        <div className="mx-auto flex w-full max-w-480 flex-col justify-between gap-14 lg:min-h-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28vw)] lg:gap-10">
            <section aria-labelledby="footer-navigation">
              <nav id="footer-navigation" aria-label="Footer navigation">
                <ul>
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink label={link.label} href={link.href} />
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            <aside className="flex flex-col gap-8 pt-1 md:gap-10 lg:pl-2">
              <ul className="grid max-w-xs gap-1.5">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <AsideLink label={link.label} href={link.href} />
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end lg:grid-cols-[1fr_1fr_1fr]">
            <FooterTime />
            <div className="max-w-sm space-y-2">
              <BackToTopButton />
            </div>
            <p className="text-base font-medium leading-none tracking-tight text-white/82 lg:text-right">
              &copy;{new Date().getFullYear()} Karnik Kanojia
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-[16.666vh] min-h-24 overflow-hidden bg-black lg:h-full lg:min-h-0">
        <Dither
          waveColor={[0.5,0.5,0.5]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
    </footer>
  );
}
