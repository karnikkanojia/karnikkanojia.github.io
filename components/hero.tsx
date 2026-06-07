"use client";

import oracleLogo from "@/assets/hero/oracle-icon-logo.svg";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { ShieldCheck, Sparkles, Workflow } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";

const focusWords = [
  { label: "reliable", icon: ShieldCheck },
  { label: "automated", icon: Workflow },
  { label: "intelligent", icon: Sparkles },
];

export function Hero() {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);

  useEffect(() => {
    const handleLoaderComplete = () => {
      setIsLoaderComplete(true);
    };

    window.addEventListener("site-loader:complete", handleLoaderComplete, { once: true });

    return () => {
      window.removeEventListener("site-loader:complete", handleLoaderComplete);
    };
  }, []);

  return (
    <section
      style={{ "--hero-nav-offset": "2.75rem" } as CSSProperties}
      className="relative mt-(--hero-nav-offset) h-[calc(100vh-var(--hero-nav-offset))] w-full bg-black p-3 md:[--hero-nav-offset:3rem] md:p-4"
    >
      <div className="relative h-full w-full overflow-hidden bg-black rounded-2xl">
        <AnimatedGradient
          config={{
            preset: "Ghost",
          }}
          noise={{ opacity: 0.14, scale: 0.8 }}
          radius="1rem"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-8 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-[min(48rem,calc(100vw-2.5rem))] flex-col items-start text-left text-white drop-shadow-[0_18px_48px_rgb(0_0_0/0.45)]"
          >
            <h1 className="flex max-w-3xl flex-col items-start text-xl font-medium leading-[1.02] tracking-normal text-white md:text-2xl lg:text-4xl">
              <span>exploring &amp; building</span>
              <span>
                <AnimatedTextCycle
                  words={focusWords}
                  interval={2600}
                  repeat={false}
                  startWhen={isLoaderComplete}
                  className="font-normal italic text-white [font-family:var(--font-playfair-display),Georgia,serif]"
                />{" "}
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
