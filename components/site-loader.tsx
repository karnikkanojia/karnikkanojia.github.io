"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const portraits = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=85",
    alt: "Portrait in warm studio light",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=85",
    alt: "Portrait against a neutral backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=85",
    alt: "Close portrait with soft contrast",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=85",
    alt: "Portrait with direct eye contact",
  },
];

const introDelay = 850;
const countDuration = 3300;
const exitDelay = 850;
const keepLoaderVisible = true;

const spinnerDots = [
  { position: "rotate-0", opacity: "opacity-[0.22]" },
  { position: "rotate-[36deg]", opacity: "opacity-[0.30]" },
  { position: "rotate-[72deg]", opacity: "opacity-[0.37]" },
  { position: "rotate-[108deg]", opacity: "opacity-[0.45]" },
  { position: "rotate-[144deg]", opacity: "opacity-[0.52]" },
  { position: "rotate-180", opacity: "opacity-[0.60]" },
  { position: "rotate-[216deg]", opacity: "opacity-[0.67]" },
  { position: "rotate-[252deg]", opacity: "opacity-[0.75]" },
  { position: "rotate-[288deg]", opacity: "opacity-[0.82]" },
  { position: "rotate-[324deg]", opacity: "opacity-[0.90]" },
];

export function SiteLoader() {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    portraits.forEach((portrait) => {
      const image = new Image();
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
          if (keepLoaderVisible) {
            setCount(100);
            return;
          }

          setIsExiting(true);
          exitTimer = window.setTimeout(() => setIsVisible(false), exitDelay);
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
          duration: 0.36,
          delay: isExiting ? 0.44 : 0,
          ease: [0.23, 1, 0.32, 1],
        }}
      />

      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,1.8rem)] left-[clamp(1.1rem,2.3vw,1.8rem)] z-10 font-sans text-[clamp(4rem,5vw,6.8rem)] leading-[0.78] font-normal tracking-normal tabular-nums max-[720px]:text-[clamp(3rem,17vw,4.4rem)]"
        animate={
          isExiting
            ? { x: "-34%", y: "-42%", opacity: 0 }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.62, ease: [0.77, 0, 0.175, 1] }}
      >
        {count}
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 z-10 aspect-3/4 w-[clamp(14rem,18.5vw,21rem)] -translate-x-1/2 translate-y-[-44%] overflow-hidden max-[720px]:w-[clamp(10.5rem,50vw,15.5rem)] max-[720px]:translate-y-[-42%]"
        animate={{
          filter: isExiting ? "blur(18px)" : "blur(0px)",
          opacity: isExiting ? 0 : 1,
        }}
        transition={{ duration: 0.58, ease: [0.23, 1, 0.32, 1] }}
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
              duration: 0.85,
              delay: index * 0.24,
              ease: [0.77, 0, 0.175, 1],
            }}
          >
            <img className="h-full w-full object-cover" src={portrait.src} alt={portrait.alt} />
          </motion.figure>
        ))}
      </motion.div>

      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,2rem)] right-[clamp(1.1rem,2.3vw,2rem)] z-10 grid w-[clamp(2.45rem,3.1vw,3.1rem)] place-items-center max-[720px]:top-[1.05rem] max-[720px]:right-[1.05rem] max-[720px]:w-[2.45rem]"
        animate={
          isExiting
            ? { x: "38%", y: "-44%", opacity: 0 }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.62, ease: [0.77, 0, 0.175, 1] }}
      >
        <img className="block h-auto w-full" src="/monogram-dark.svg" alt="" />
      </motion.div>

      <motion.div
        className="absolute right-[clamp(1rem,1.8vw,1.6rem)] bottom-[clamp(1rem,1.8vw,1.6rem)] z-10 size-9"
        aria-hidden="true"
        animate={
          isExiting
            ? { x: "40%", y: "42%", opacity: 0 }
            : { x: 0, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.62, ease: [0.77, 0, 0.175, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        >
          {spinnerDots.map((dot) => (
            <span key={dot.position} className={`absolute inset-0 ${dot.position}`}>
              <span
                className={`absolute top-0 left-1/2 size-1.5 -translate-x-1/2 bg-[#08080a] ${dot.opacity}`}
              />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
