"use client"

import oracleLogo from "@/assets/hero/oracle-icon-logo.svg"
import { AnimatedGradient } from "@/components/ui/animated-gradient"
import { TextFlip } from "@/components/text-flip"
import { ShieldCheck, Sparkles, Workflow } from "lucide-react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState, type CSSProperties } from "react"

const HERO_STYLE = {
  "--hero-nav-offset": "2.75rem",
  "--hero-pad-x": "0.75rem",
  "--hero-pad-top": "0.25rem",
  "--hero-pad-bottom": "0.75rem",
} as CSSProperties
const GRADIENT_CONFIG = { preset: "Ghost" } as const
const GRADIENT_NOISE = { opacity: 0.14, scale: 0.8 } as const
const GRADIENT_INITIAL_TIME = 18
const COPY_REVEAL_TRANSITION = {
  duration: 0.45,
  delay: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const
const focusWords = [
  { label: "reliable", icon: ShieldCheck },
  { label: "automated", icon: Workflow },
  { label: "intelligent", icon: Sparkles },
]
const animatedWordClassName =
  "inline-flex items-baseline gap-[0.16em] font-normal italic text-white [font-family:var(--font-playfair-display),Georgia,serif]"
const TEXT_FLIP_VARIANTS = {
  initial: { y: -8, opacity: 0, filter: "blur(4px)" },
  animate: { y: 0, opacity: 1, filter: "blur(0px)" },
  exit: { y: 8, opacity: 0, filter: "blur(4px)" },
} as const
const TEXT_FLIP_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const

function useSiteLoaderEvent(eventName: string) {
  const [hasFired, setHasFired] = useState(false)

  useEffect(() => {
    const handleEvent = () => {
      setHasFired(true)
    }

    window.addEventListener(eventName, handleEvent, {
      once: true,
    })

    return () => {
      window.removeEventListener(eventName, handleEvent)
    }
  }, [eventName])

  return hasFired
}

export function Hero() {
  const isLoaderComplete = useSiteLoaderEvent("site-loader:complete")
  const hasHeroEntered = useSiteLoaderEvent("site-loader:hero-enter")
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      style={HERO_STYLE}
      className="relative mt-(--hero-nav-offset) h-[calc(100vh-var(--hero-nav-offset))] w-full bg-black px-(--hero-pad-x) pt-(--hero-pad-top) pb-(--hero-pad-bottom) md:[--hero-nav-offset:3rem] md:[--hero-pad-bottom:1rem] md:[--hero-pad-top:0.5rem] md:[--hero-pad-x:1rem]"
    >
      <HeroSurface
        animateGradient
        playTextFlip={isLoaderComplete}
        revealCopy={hasHeroEntered}
        shouldReduceMotion={shouldReduceMotion}
      />
    </section>
  )
}

type HeroSurfaceProps = {
  animateGradient?: boolean
  playTextFlip: boolean
  revealCopy: boolean
  resizeGradientWhilePaused?: boolean
  shouldReduceMotion?: boolean | null
}

export function HeroSurface({
  animateGradient = true,
  playTextFlip,
  revealCopy,
  resizeGradientWhilePaused = true,
  shouldReduceMotion = false,
}: HeroSurfaceProps) {
  return (
    <div
      data-hero-surface="true"
      className="relative h-full w-full overflow-hidden rounded-2xl bg-black"
    >
      <AnimatedGradient
        animate={animateGradient}
        config={GRADIENT_CONFIG}
        initialTimeSeconds={GRADIENT_INITIAL_TIME}
        noise={GRADIENT_NOISE}
        radius="1rem"
        resizeWhilePaused={resizeGradientWhilePaused}
      />
      <div className="absolute inset-0 ring-1 ring-white/10 ring-inset" />
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-8 md:pb-8">
        <motion.div
          initial={false}
          animate={
            revealCopy
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(8px)" }
          }
          transition={COPY_REVEAL_TRANSITION}
          className="flex max-w-[min(48rem,calc(100vw-2.5rem))] flex-col items-start text-left text-white drop-shadow-[0_18px_48px_rgb(0_0_0/0.45)]"
        >
          <h1 className="flex max-w-3xl flex-col items-start text-xl leading-[1.02] font-medium tracking-normal text-white md:text-2xl lg:text-4xl">
            <span>exploring &amp; building</span>
            <span>
              <motion.span className="inline-block align-baseline whitespace-nowrap">
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
                    play={playTextFlip}
                    loop={false}
                    interval={1.8}
                    className={animatedWordClassName}
                    variants={TEXT_FLIP_VARIANTS}
                    transition={TEXT_FLIP_TRANSITION}
                  >
                    {focusWords.map(({ label, icon: Icon }) => (
                      <span
                        key={label}
                        className="inline-flex items-baseline gap-[0.16em]"
                      >
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
          <p className="mt-2 flex items-center gap-2 [font-family:var(--font-kh-teka),sans-serif] text-sm font-normal tracking-wide text-white/58 md:text-base">
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
  )
}
