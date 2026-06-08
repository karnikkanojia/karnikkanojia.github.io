"use client";

import oracleLogo from "@/assets/hero/oracle-icon-logo.svg";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { TextFlip } from "@/components/text-flip";
import { ShieldCheck, Sparkles, Workflow } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";

const HERO_STYLE = { "--hero-nav-offset": "2.75rem" } as CSSProperties;
const GRADIENT_CONFIG = { preset: "Ghost" } as const;
const GRADIENT_NOISE = { opacity: 0.14, scale: 0.8 } as const;
const COPY_REVEAL_TRANSITION = {
  duration: 0.45,
  delay: 0.08,
  ease: [0.22, 1, 0.36, 1],
} as const;
const focusWords = [
  { label: "reliable", icon: ShieldCheck },
  { label: "automated", icon: Workflow },
  { label: "intelligent", icon: Sparkles },
];
const animatedWordClassName =
  "inline-flex items-baseline gap-[0.16em] font-normal italic text-white [font-family:var(--font-playfair-display),Georgia,serif]";
const TEXT_FLIP_VARIANTS = {
  initial: { y: -8, opacity: 0, filter: "blur(4px)" },
  animate: { y: 0, opacity: 1, filter: "blur(0px)" },
  exit: { y: 8, opacity: 0, filter: "blur(4px)" },
} as const;
const TEXT_FLIP_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const;

function useSiteLoaderComplete() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const handleLoaderComplete = () => {
      setIsComplete(true);
    };

    window.addEventListener("site-loader:complete", handleLoaderComplete, { once: true });

    return () => {
      window.removeEventListener("site-loader:complete", handleLoaderComplete);
    };
  }, []);

  return isComplete;
}

export function Hero() {
  const isLoaderComplete = useSiteLoaderComplete();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      style={HERO_STYLE}
      className="relative mt-(--hero-nav-offset) h-[calc(100vh-var(--hero-nav-offset))] w-full bg-black p-3 md:[--hero-nav-offset:3rem] md:p-4"
    >
      <div className="relative h-full w-full overflow-hidden bg-black rounded-2xl">
        <AnimatedGradient
          config={GRADIENT_CONFIG}
          noise={GRADIENT_NOISE}
          radius="1rem"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-8 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={COPY_REVEAL_TRANSITION}
            className="flex max-w-[min(48rem,calc(100vw-2.5rem))] flex-col items-start text-left text-white drop-shadow-[0_18px_48px_rgb(0_0_0/0.45)]"
          >
            <h1 className="flex max-w-3xl flex-col items-start text-xl font-medium leading-[1.02] tracking-normal text-white md:text-2xl lg:text-4xl">
              <span>exploring &amp; building</span>
              <span>
                <motion.span
                  className="inline-block whitespace-nowrap align-baseline"
                >
                  {shouldReduceMotion ? (
                    <span className={animatedWordClassName}>
                      <Sparkles
                        aria-hidden="true"
                        className="mb-[0.06em] size-[0.58em] stroke-[1.8]"
                      />
                      intelligent
                    </span>
                  ) : (
                    <TextFlip
                      as={motion.span}
                      play={isLoaderComplete}
                      loop={false}
                      interval={1.8}
                      className={animatedWordClassName}
                      variants={TEXT_FLIP_VARIANTS}
                      transition={TEXT_FLIP_TRANSITION}
                    >
                      {focusWords.map(({ label, icon: Icon }) => (
                        <span key={label} className="inline-flex items-baseline gap-[0.16em]">
                          <Icon
                            aria-hidden="true"
                            className="mb-[0.06em] size-[0.58em] stroke-[1.8]"
                          />
                          {label}
                        </span>
                      ))}
                    </TextFlip>
                  )}
                </motion.span>{" "}
                systems.
              </span>
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm font-normal tracking-wide text-white/58 [font-family:var(--font-kh-teka),sans-serif] md:text-base">
              <span>site reliability engineer at</span>
              <Image
                src={oracleLogo}
                alt="Oracle"
                width={20}
                height={20}
                className="size-5 rounded-sm"
                priority
              />
              <span>currently</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
