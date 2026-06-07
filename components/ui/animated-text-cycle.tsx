"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AnimatedTextCycleWord = string | { label: string; icon?: LucideIcon };

interface AnimatedTextCycleProps {
  words: AnimatedTextCycleWord[];
  interval?: number;
  className?: string;
  repeat?: boolean;
  startWhen?: boolean;
}

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
  repeat = true,
  startWhen = true,
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);
  const currentWord = words[currentIndex];
  const currentLabel = typeof currentWord === "string" ? currentWord : currentWord.label;
  const CurrentIcon = typeof currentWord === "string" ? undefined : currentWord.icon;

  useEffect(() => {
    if (!measureRef.current) {
      return;
    }

    const elements = measureRef.current.children;
    if (elements.length > currentIndex) {
      const newWidth = elements[currentIndex].getBoundingClientRect().width;
      setWidth(`${newWidth}px`);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!startWhen || words.length < 2) {
      return;
    }

    if (!repeat && currentIndex >= words.length - 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex < words.length) {
          return nextIndex;
        }

        return repeat ? 0 : prevIndex;
      });
    }, interval);

    return () => window.clearTimeout(timer);
  }, [currentIndex, interval, repeat, startWhen, words.length]);

  const containerVariants = {
    hidden: {
      y: -20,
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
        ease: [0.64, 0, 0.78, 0] as const,
      },
    },
  };

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
        style={{ visibility: "hidden" }}
      >
        {words.map((word) => {
          const label = typeof word === "string" ? word : word.label;
          const Icon = typeof word === "string" ? undefined : word.icon;

          return (
          <span key={label} className={`inline-flex items-baseline gap-[0.16em] ${className}`}>
            {Icon ? <Icon aria-hidden="true" className="mb-[0.06em] size-[0.58em] stroke-[1.8]" /> : null}
            {label}
          </span>
          );
        })}
      </div>

      <motion.span
        className="relative inline-block"
        animate={{
          width,
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-flex items-baseline gap-[0.16em] ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {CurrentIcon ? (
              <CurrentIcon aria-hidden="true" className="mb-[0.06em] size-[0.58em] stroke-[1.8]" />
            ) : null}
            {currentLabel}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
