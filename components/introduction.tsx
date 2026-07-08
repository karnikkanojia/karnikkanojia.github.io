"use client";

import { AppleHelloEffectHindi } from "@/components/apple-hello-effect-hindi";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const tagline = "Technology matters most when it has intent.";

const introBody =
  "I'm Karnik Kanojia, a site reliability engineer and builder drawn to systems that are reliable, intelligent, and useful in the real world. My work sits at the intersection of data science, real-time products, and social impact, with a special focus on machine learning for medical images like photos, X-rays, CT scans, and MRI scans.";

const helloClassName =
  "mx-auto h-auto w-full max-w-[min(58vw,31rem)] text-foreground";
const taglineClassName =
  "max-w-[12ch] text-center text-[clamp(3rem,8.5vw,8rem)] leading-[0.9] font-medium tracking-normal text-balance";
const bioClassName =
  "max-w-4xl text-[clamp(1.45rem,2.55vw,2.9rem)] leading-[1.08] font-light tracking-normal text-foreground/78 text-balance";
const reducedMotionHelloClassName =
  "h-auto w-full max-w-[26rem] text-foreground";
const reducedMotionTaglineClassName =
  "max-w-4xl text-4xl leading-[0.95] font-medium tracking-normal text-balance md:text-5xl lg:text-6xl";
const reducedMotionBioClassName =
  "max-w-3xl text-xl leading-[1.16] font-light tracking-normal text-foreground/72 md:text-2xl lg:text-3xl";

type StageMode = "before" | "fixed" | "after";

function PanelFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex h-screen w-screen shrink-0 items-center justify-center px-5 pt-16 pb-10 text-foreground md:px-8 md:pt-20 md:pb-14 ${className}`}
    >
      {children}
    </section>
  );
}

export function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageMode, setStageMode] = useState<StageMode>("before");
  const shouldReduceMotion = useReducedMotion();
  const isIntroInView = useInView(stageRef, { once: true, amount: 0.45 });
  const introProgress = useMotionValue(0);
  const helloDrawProgress = useTransform(introProgress, [0.03, 0.28], [0, 1]);
  const helloMetaOpacity = useTransform(introProgress, [0, 0.08, 0.24], [1, 1, 0]);
  const helloScale = useTransform(introProgress, [0, 0.28], [0.94, 1]);
  const trackTransform = useTransform(
    introProgress,
    [0, 0.26, 0.52, 0.82, 1],
    [
      "translate3d(0%, 0, 0)",
      "translate3d(0%, 0, 0)",
      "translate3d(-33.333333%, 0, 0)",
      "translate3d(-66.666667%, 0, 0)",
      "translate3d(-66.666667%, 0, 0)",
    ]
  );
  const taglineTransform = useTransform(
    introProgress,
    [0.34, 0.46, 0.58, 0.7],
    [
      "translate3d(0, 64vh, 0)",
      "translate3d(0, 0vh, 0)",
      "translate3d(0, 0vh, 0)",
      "translate3d(0, -64vh, 0)",
    ]
  );
  const taglineOpacity = useTransform(
    introProgress,
    [0.32, 0.44, 0.6, 0.72],
    [0, 1, 1, 0]
  );
  const bioTransform = useTransform(
    introProgress,
    [0.72, 0.88],
    ["translate3d(0, 32px, 0)", "translate3d(0, 0px, 0)"]
  );
  const bioOpacity = useTransform(introProgress, [0.72, 0.88], [0, 1]);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = Math.min(
        Math.max(-rect.top / scrollableDistance, 0),
        1
      );
      const nextStageMode =
        rect.top > 0
          ? "before"
          : rect.bottom <= window.innerHeight
            ? "after"
            : "fixed";

      introProgress.set(nextProgress);
      setStageMode((currentMode) =>
        currentMode === nextStageMode ? currentMode : nextStageMode
      );
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [introProgress]);

  if (shouldReduceMotion) {
    return (
      <section
        id="about"
        className="bg-black px-5 py-24 text-foreground md:px-8 md:py-32"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-24">
          <div className="flex min-h-[48vh] items-center justify-center">
            <AppleHelloEffectHindi
              className={reducedMotionHelloClassName}
              durationScale={0.7}
            />
          </div>

          <h2 className={reducedMotionTaglineClassName}>
            {tagline}
          </h2>

          <p className={reducedMotionBioClassName}>
            {introBody}
          </p>
        </div>
      </section>
    );
  }

  const stageClassName =
    stageMode === "fixed"
      ? "fixed inset-x-0 top-0 z-20 h-screen overflow-hidden bg-black"
      : stageMode === "after"
        ? "absolute inset-x-0 bottom-0 h-screen overflow-hidden bg-black"
        : "absolute inset-x-0 top-0 h-screen overflow-hidden bg-black";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[480vh] bg-black text-foreground"
      aria-label="Introduction"
    >
      <div ref={stageRef} data-intro-stage className={stageClassName}>
        <motion.div
          data-intro-track
          className="flex h-screen w-[300vw]"
          style={{ transform: trackTransform }}
        >
          <PanelFrame>
            <div className="flex w-full max-w-6xl flex-col items-center gap-8 text-center">
              <motion.p
                style={{ opacity: helloMetaOpacity }}
                className="font-mono text-xs tracking-[0.32em] text-foreground/42 uppercase"
              >
                Karnik Kanojia
              </motion.p>
              <motion.div
                data-intro-hello
                style={{ scale: helloScale }}
                className="w-full"
              >
                <AppleHelloEffectHindi
                  play={isIntroInView}
                  drawProgress={helloDrawProgress}
                  durationScale={0.72}
                  className={helloClassName}
                />
              </motion.div>
            </div>
          </PanelFrame>

          <PanelFrame>
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <motion.h2
                data-intro-tagline
                style={{
                  opacity: taglineOpacity,
                  transform: taglineTransform,
                }}
                className={taglineClassName}
              >
                {tagline}
              </motion.h2>
            </div>
          </PanelFrame>

          <PanelFrame className="justify-start md:justify-center">
            <motion.div
              data-intro-bio
              style={{ opacity: bioOpacity, transform: bioTransform }}
              className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-[0.28fr_0.72fr] md:items-start md:gap-14"
            >
              <div className="font-mono text-xs tracking-[0.32em] text-foreground/40 uppercase">
                About
              </div>
              <p className={bioClassName}>
                {introBody}
              </p>
            </motion.div>
          </PanelFrame>
        </motion.div>
      </div>
    </section>
  );
}
