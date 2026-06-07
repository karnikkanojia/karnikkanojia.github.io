"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import bengaluruImage from "@/assets/site-loader/bengaluru.jpg";
import everestImage from "@/assets/site-loader/everest.jpg";
import flamingoImage from "@/assets/site-loader/flamingo.jpg";
import kashmirImage from "@/assets/site-loader/kashmir.jpg";
import pondicherryImage from "@/assets/site-loader/pondicherry.jpg";

const portraits: { src: string; alt: string }[] = [
  {
    src: kashmirImage.src,
    alt: "Snowy Kashmir mountain valley",
  },
  {
    src: everestImage.src,
    alt: "Mount Everest above the clouds",
  },
  {
    src: flamingoImage.src,
    alt: "Pink flamingo standing in shallow water",
  },
  {
    src: bengaluruImage.src,
    alt: "Bengaluru city street at night",
  },
  {
    src: pondicherryImage.src,
    alt: "Pondicherry coastal street scene",
  },
];

const introDelay = 850;
const countDuration = 3300;
const exitDelay = 850;
const imageRevealDuration = 0.62;
const imageSequenceDuration = 2000;
const imageExitDelay = 0.18;
const imageRevealStagger = Math.max(
  (imageSequenceDuration / 1000 - imageRevealDuration) / Math.max(portraits.length - 1, 1),
  0,
);

const loaderCells = Array.from({ length: 9 }, (_, index) => ({
  id: index,
  isOuter: index !== 4,
}));
const loaderDotColors = ["#08080a", "#2a2a2d", "#5a5a60", "#8b8b91", "#c7c7cc"];

export function SiteLoader() {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    portraits.forEach((portrait) => {
      const image = new window.Image();
      image.src = portrait.src;
    });

    let frame = 0;
    let startTimer = 0;
    let exitTimer = 0;

    startTimer = window.setTimeout(() => {
      setHasStarted(true);

      const startedAt = performance.now();

      const updateCounter = (time: number) => {
        const progress = Math.min((time - startedAt) / countDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setCount(Math.round(eased * 100));

        if (progress < 1) {
          frame = requestAnimationFrame(updateCounter);
        } else {
          setCount(100);
          setIsExiting(true);
          exitTimer = window.setTimeout(() => {
            setIsVisible(false);
            window.dispatchEvent(new Event("site-loader:complete"));
          }, exitDelay);
        }
      };

      frame = requestAnimationFrame(updateCounter);
    }, introDelay);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-10000 overflow-hidden text-[#08080a]"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 bg-[hsl(0_0%_98%)]"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{
          duration: 0.38,
          delay: isExiting ? 0.18 : 0,
          ease: [0.23, 1, 0.32, 1],
        }}
      />

      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,1.8rem)] left-[clamp(1.1rem,2.3vw,1.8rem)] z-10 font-sans text-[clamp(4rem,5vw,6.8rem)] leading-[0.78] font-normal tracking-normal tabular-nums max-[720px]:text-[clamp(3rem,17vw,4.4rem)]"
        animate={
          isExiting
            ? { x: [0, "5%", "-34%"], y: [0, "6%", "-42%"], opacity: [1, 1, 0] }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={
          isExiting
            ? { duration: 0.5, ease: [0.77, 0, 0.175, 1], times: [0, 0.2, 1] }
            : { duration: 0.62, ease: [0.77, 0, 0.175, 1] }
        }
      >
        {count}
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 z-10 aspect-3/4 w-[clamp(14rem,18.5vw,21rem)] -translate-x-1/2 translate-y-[-44%] overflow-hidden max-[720px]:w-[clamp(10.5rem,50vw,15.5rem)] max-[720px]:translate-y-[-42%]"
      >
        <motion.div
          className="relative h-full w-full origin-center overflow-hidden"
          animate={
            isExiting
              ? {
                  filter: ["blur(0px)", "blur(0px)", "blur(14px)"],
                  opacity: [1, 1, 0],
                  scale: [1, 1.025, 0.94],
                }
              : { filter: "blur(0px)", opacity: 1, scale: 1 }
          }
          transition={
            isExiting
              ? {
                  duration: 0.82,
                  delay: imageExitDelay,
                  ease: [0.23, 1, 0.32, 1],
                  times: [0, 0.34, 1],
                }
              : { duration: 0.58, ease: [0.23, 1, 0.32, 1] }
          }
        >
          {portraits.map((portrait, index) => (
            <motion.figure
              key={portrait.src}
              className="absolute inset-0 h-full w-full overflow-hidden will-change-[clip-path,opacity]"
              style={{ zIndex: index + 1 }}
              initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              animate={
                hasStarted
                  ? { opacity: 1, clipPath: "inset(0% 0 0 0)" }
                  : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
              }
              transition={{
                duration: imageRevealDuration,
                delay: index * imageRevealStagger,
                ease: [0.77, 0, 0.175, 1],
              }}
            >
              <Image
                className="object-cover"
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(max-width: 720px) 50vw, 21rem"
              />
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,2rem)] right-[clamp(1.1rem,2.3vw,2rem)] z-10 grid w-[clamp(2.45rem,3.1vw,3.1rem)] place-items-center max-[720px]:top-[1.05rem] max-[720px]:right-[1.05rem] max-[720px]:w-[2.45rem]"
        animate={
          isExiting
            ? { x: [0, "-5%", "38%"], y: [0, "6%", "-44%"], opacity: [1, 1, 0] }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={
          isExiting
            ? { duration: 0.5, ease: [0.77, 0, 0.175, 1], times: [0, 0.2, 1] }
            : { duration: 0.62, ease: [0.77, 0, 0.175, 1] }
        }
      >
        <Image
          className="block h-auto w-full"
          src="/monogram-dark.svg"
          alt=""
          width={64}
          height={64}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute right-[clamp(1rem,1.8vw,1.6rem)] bottom-[clamp(1rem,1.8vw,1.6rem)] z-10 grid size-12 grid-cols-3 grid-rows-3 gap-0.5"
        aria-hidden="true"
        animate={
          isExiting
            ? { x: [0, "-6%", "40%"], y: [0, "-6%", "42%"], opacity: [1, 1, 0] }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={
          isExiting
            ? { duration: 0.5, ease: [0.77, 0, 0.175, 1], times: [0, 0.2, 1] }
            : { duration: 0.62, ease: [0.77, 0, 0.175, 1] }
        }
      >
        {loaderCells.map((cell) => (
          <span key={cell.id} className="grid place-items-center">
            {cell.isOuter ? (
              <motion.span
                className="size-2.5"
                animate={{
                  backgroundColor: loaderDotColors,
                }}
                transition={{
                  duration: 1,
                  delay: cell.id * 0.08,
                  ease: [0.77, 0, 0.175, 1],
                  repeat: Infinity,
                }}
              />
            ) : null}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
