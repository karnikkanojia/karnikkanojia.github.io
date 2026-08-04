"use client"

import oracleLogo from "@/public/logos/work/oracle.jpg"
import { AnimatedGradient } from "@/components/ui/animated-gradient"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { Pause, Play, Sparkles } from "lucide-react"
import Image from "next/image"
import { type ReactNode, type Ref, useEffect, useRef, useState } from "react"

const GRADIENT_CONFIG = {
  preset: "custom",
  color1: "#000814",
  color2: "#001d3d",
  color3: "#00b4d8",
  rotation: 45,
  proportion: 50,
  scale: 0.3,
  speed: 8,
  distortion: 10,
  swirl: 30,
  swirlIterations: 5,
  softness: 100,
  offset: 0,
  shape: "Checks",
  shapeSize: 60,
} as const
const GRADIENT_NOISE = { opacity: 0.14, scale: 0.8 } as const
const GRADIENT_INITIAL_TIME = 18
const GRADIENT_RADIUS = "0.625rem"
const DESKTOP_QUERY = "(min-width: 768px)"
const DESKTOP_ENTRY_START_SCALE = 0.04
const DESKTOP_ENTRY_SCALE = 0.4
const DESKTOP_ENTRY_Y_OFFSET = -0.08
const DESKTOP_STICKY_TOP = 58
const TEXT_FADE_TARGET_SCALE = 0.6
const HERO_BACKPLATE_ENTRY_DELAYS = [110, 55] as const
const HERO_BACKPLATE_GROWTH_LEADS = [0.045, 0.023] as const
const HERO_BACKPLATE_RESPONSES = [8, 12] as const
const HERO_BACKPLATE_LEAD_ATTACK = 10
const HERO_BACKPLATE_LEAD_RELEASE = 6
const HERO_BACKPLATE_LEAD_SUSTAIN = 32
const HERO_BACKPLATE_LEAD_DECAY = 140

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heroWindow = windowRef.current
    const heroCopy = copyRef.current
    if (!section || !heroWindow || !heroCopy) return
    const maskWords = Array.from(
      heroCopy.querySelectorAll<HTMLElement>("[data-hero-mask-word]")
    )
    const backplates = Array.from(
      section.querySelectorAll<HTMLElement>("[data-hero-backplate]")
    )

    const desktop = window.matchMedia(DESKTOP_QUERY)
    let introComplete =
      document.documentElement.dataset.siteIntroComplete === "true"
    let navbarSettled =
      document.documentElement.dataset.siteNavbarSettled === "true"
    let entryComplete = false
    let entryStarted = false
    let wordsStarted = false
    let entryAnimations: Animation[] = []
    let wordAnimations: Animation[] = []
    let frameId: number | undefined
    let sectionTop = 0
    let scrollDistance = 1
    let scaleScrollDistance = 1
    let previousScale = DESKTOP_ENTRY_SCALE
    let backplateFrameId: number | undefined
    let backplatePreviousTime: number | undefined
    let backplateTargetScale = DESKTOP_ENTRY_SCALE
    let backplateTargetY = window.innerHeight * DESKTOP_ENTRY_Y_OFFSET
    let backplateLastGrowthTime = Number.NEGATIVE_INFINITY
    let backplateLeadStrength = 0
    const backplateScales = backplates.map(() => DESKTOP_ENTRY_SCALE)

    const animateBackplates = (time: number) => {
      backplateFrameId = undefined
      const deltaSeconds =
        backplatePreviousTime === undefined
          ? 1 / 60
          : Math.min(
              0.05,
              Math.max(1 / 240, (time - backplatePreviousTime) / 1000)
            )
      backplatePreviousTime = time
      const timeSinceGrowth = time - backplateLastGrowthTime
      const desiredLeadStrength =
        timeSinceGrowth <= HERO_BACKPLATE_LEAD_SUSTAIN
          ? 1
          : Math.exp(
              -(timeSinceGrowth - HERO_BACKPLATE_LEAD_SUSTAIN) /
                HERO_BACKPLATE_LEAD_DECAY
            )
      const leadResponse =
        desiredLeadStrength > backplateLeadStrength
          ? HERO_BACKPLATE_LEAD_ATTACK
          : HERO_BACKPLATE_LEAD_RELEASE
      const leadFollowAmount = 1 - Math.exp(-leadResponse * deltaSeconds)
      backplateLeadStrength +=
        (desiredLeadStrength - backplateLeadStrength) * leadFollowAmount
      let shouldContinue =
        desiredLeadStrength > 0.001 || backplateLeadStrength > 0.001

      backplates.forEach((backplate, index) => {
        const growthLead =
          (HERO_BACKPLATE_GROWTH_LEADS[index] ?? 0) * backplateLeadStrength
        const desiredScale = Math.min(1, backplateTargetScale + growthLead)
        const response = HERO_BACKPLATE_RESPONSES[index] ?? 10
        const followAmount = 1 - Math.exp(-response * deltaSeconds)
        const nextScale =
          (backplateScales[index] ?? backplateTargetScale) +
          (desiredScale - (backplateScales[index] ?? backplateTargetScale)) *
            followAmount

        backplateScales[index] = nextScale
        backplate.style.transform = `translateY(${backplateTargetY}px) scale(${nextScale})`

        if (Math.abs(desiredScale - nextScale) > 0.0002) {
          shouldContinue = true
        }
      })

      if (shouldContinue) {
        backplateFrameId = requestAnimationFrame(animateBackplates)
      } else {
        backplatePreviousTime = undefined
      }
    }

    const requestBackplateAnimation = () => {
      if (backplateFrameId === undefined) {
        backplateFrameId = requestAnimationFrame(animateBackplates)
      }
    }

    const cancelBackplateAnimation = () => {
      if (backplateFrameId !== undefined) {
        cancelAnimationFrame(backplateFrameId)
        backplateFrameId = undefined
      }
      backplatePreviousTime = undefined
      backplateLastGrowthTime = Number.NEGATIVE_INFINITY
      backplateLeadStrength = 0
    }

    const measure = () => {
      const sectionRect = section.getBoundingClientRect()
      const stickyHeight = heroWindow.parentElement?.clientHeight ?? 0
      sectionTop = sectionRect.top + window.scrollY
      scrollDistance = Math.max(1, section.offsetHeight - stickyHeight)
      scaleScrollDistance = Math.min(window.innerHeight, scrollDistance)
    }

    const render = () => {
      frameId = undefined

      if (!desktop.matches || !introComplete) {
        cancelBackplateAnimation()
        heroWindow.style.removeProperty("transform")
        heroWindow.style.removeProperty("transform-origin")
        heroWindow.style.removeProperty("will-change")
        heroCopy.style.removeProperty("opacity")
        heroCopy.style.removeProperty("will-change")
        maskWords.forEach((word) => {
          word.style.removeProperty("transform")
          word.style.removeProperty("will-change")
        })
        backplates.forEach((backplate) => {
          backplate.style.removeProperty("transform")
        })
        return
      }

      if (!entryComplete) return

      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY + DESKTOP_STICKY_TOP - sectionTop) /
            scaleScrollDistance
        )
      )
      const easedProgress = progress * progress * (3 - 2 * progress)
      const scale =
        DESKTOP_ENTRY_SCALE + easedProgress * (1 - DESKTOP_ENTRY_SCALE)
      const translateY =
        window.innerHeight * DESKTOP_ENTRY_Y_OFFSET * (1 - easedProgress)
      const textFadeProgress = Math.min(
        1,
        Math.max(
          0,
          (scale - DESKTOP_ENTRY_SCALE) /
            (TEXT_FADE_TARGET_SCALE - DESKTOP_ENTRY_SCALE)
        )
      )
      const rawTextOpacity = Math.max(0, 1 - textFadeProgress)
      const textOpacity = rawTextOpacity <= 0.1 ? 0 : rawTextOpacity

      heroWindow.style.transform = `translateY(${translateY}px) scale(${scale})`
      heroWindow.style.transformOrigin = "center"
      heroWindow.style.willChange = progress < 1 ? "transform" : "auto"
      heroCopy.style.opacity = textOpacity.toFixed(3)
      heroCopy.style.willChange =
        textOpacity > 0 && progress > 0 ? "opacity" : "auto"

      const isGrowing = scale > previousScale + 0.0001
      const canLead = isGrowing && progress > 0 && progress < 1
      backplateTargetScale = scale
      backplateTargetY = translateY
      if (canLead) {
        backplateLastGrowthTime = performance.now()
      }
      previousScale = scale
      requestBackplateAnimation()
    }

    const requestRender = () => {
      if (frameId === undefined) frameId = requestAnimationFrame(render)
    }
    const onResize = () => {
      measure()
      requestRender()
    }
    const startWordEntry = () => {
      if (wordsStarted || !entryStarted || !desktop.matches) return
      wordsStarted = true

      wordAnimations = maskWords.map((word, index) =>
        word.animate(
          [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
          {
            delay: index * 45,
            duration: 520,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            fill: "both",
          }
        )
      )

      Promise.all(wordAnimations.map((animation) => animation.finished)).then(
        () => {
          maskWords.forEach((word) => {
            word.style.transform = "translateY(0)"
            word.style.willChange = "auto"
          })
          wordAnimations.forEach((animation) => animation.cancel())
          wordAnimations = []
        },
        () => undefined
      )
    }
    const startEntry = () => {
      if (entryStarted) return
      entryStarted = true

      if (!desktop.matches) {
        entryComplete = true
        render()
        return
      }

      const entryTranslateY = window.innerHeight * DESKTOP_ENTRY_Y_OFFSET
      heroWindow.style.transform = `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_START_SCALE})`
      heroWindow.style.transformOrigin = "center"
      heroWindow.style.willChange = "transform"
      heroCopy.style.opacity = "1"
      heroCopy.style.willChange = "opacity"
      backplates.forEach((backplate) => {
        backplate.style.transform = `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_START_SCALE})`
        backplate.style.transformOrigin = "center"
      })
      backplateScales.fill(DESKTOP_ENTRY_START_SCALE)
      backplateTargetScale = DESKTOP_ENTRY_START_SCALE
      backplateTargetY = entryTranslateY
      maskWords.forEach((word) => {
        word.style.transform = "translateY(110%)"
        word.style.willChange = "transform"
      })
      if (navbarSettled) startWordEntry()

      const frameAnimation = heroWindow.animate(
        [
          {
            transform: `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_START_SCALE})`,
          },
          {
            transform: `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_SCALE})`,
          },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
          fill: "both",
        }
      )
      const backplateAnimations = backplates.map((backplate, index) =>
        backplate.animate(
          [
            {
              transform: `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_START_SCALE})`,
            },
            {
              transform: `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_SCALE})`,
            },
          ],
          {
            delay: HERO_BACKPLATE_ENTRY_DELAYS[index] ?? 0,
            duration: 900,
            easing: "cubic-bezier(0.77, 0, 0.175, 1)",
            fill: "both",
          }
        )
      )

      entryAnimations = [frameAnimation, ...backplateAnimations]
      Promise.all(entryAnimations.map((animation) => animation.finished)).then(
        () => {
          heroWindow.style.transform = `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_SCALE})`
          backplates.forEach((backplate) => {
            backplate.style.transform = `translateY(${entryTranslateY}px) scale(${DESKTOP_ENTRY_SCALE})`
          })
          backplateScales.fill(DESKTOP_ENTRY_SCALE)
          backplateTargetScale = DESKTOP_ENTRY_SCALE
          backplateTargetY = entryTranslateY
          previousScale = DESKTOP_ENTRY_SCALE
          entryAnimations.forEach((animation) => animation.cancel())
          entryAnimations = []
          entryComplete = true
          render()
        },
        () => undefined
      )
    }
    const onIntroComplete = () => {
      introComplete = true
      startEntry()
    }
    const onNavbarSettled = () => {
      navbarSettled = true
      startWordEntry()
    }

    measure()
    window.addEventListener("scroll", requestRender, { passive: true })
    window.addEventListener("resize", onResize)
    window.addEventListener("site-loader:complete", onIntroComplete)
    window.addEventListener("site-loader:navbar-settled", onNavbarSettled)
    desktop.addEventListener("change", requestRender)
    if (introComplete) startEntry()

    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId)
      cancelBackplateAnimation()
      entryAnimations.forEach((animation) => animation.cancel())
      wordAnimations.forEach((animation) => animation.cancel())
      window.removeEventListener("scroll", requestRender)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("site-loader:complete", onIntroComplete)
      window.removeEventListener("site-loader:navbar-settled", onNavbarSettled)
      desktop.removeEventListener("change", requestRender)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-hero-scroll-section
      className="relative mt-13 h-[calc(100vh-3.25rem)] w-full px-3 pt-1 pb-3 md:mt-14.5 md:h-[calc(300vh-3.625rem)] md:px-0 md:py-0"
    >
      <div className="flex h-full flex-col md:sticky md:top-14.5 md:h-[calc(100vh-3.625rem)] md:px-4 md:pt-2 md:pb-4">
        <div className="relative h-[65vh] w-full shrink-0 md:h-full">
          <div
            data-hero-backplate
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[0.625rem] bg-[#fff68a] will-change-transform"
          />
          <div
            data-hero-backplate
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[0.625rem] bg-[#ff886b] will-change-transform"
          />
          <div ref={windowRef} className="absolute inset-0 z-2">
            <HeroSurface animateGradient />
          </div>
        </div>
        <HeroCopy
          ref={copyRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden px-12 pb-5 text-black md:block"
        />
        <HeroCopy className="flex flex-1 items-end px-5 pb-5 text-black md:hidden" />
      </div>
    </section>
  )
}

type HeroSurfaceProps = {
  animateGradient?: boolean
  resizeGradientWhilePaused?: boolean
}

export function HeroSurface({
  animateGradient = true,
  resizeGradientWhilePaused = true,
}: HeroSurfaceProps) {
  const [gradientAnimating, setGradientAnimating] = useState(animateGradient)

  return (
    <CursorFollowLabel
      className="h-full w-full"
      icon={
        gradientAnimating ? (
          <Pause aria-hidden="true" />
        ) : (
          <Play aria-hidden="true" />
        )
      }
      label={gradientAnimating ? "Pause" : "Play"}
    >
      <button
        type="button"
        data-hero-surface="true"
        aria-label="Animated gradient"
        aria-pressed={gradientAnimating}
        className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[0.625rem] border-0 bg-white p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        onClick={() => setGradientAnimating((isAnimating) => !isAnimating)}
      >
        <div data-intro-gradient className="absolute inset-0 overflow-hidden">
          <AnimatedGradient
            animate={gradientAnimating}
            config={GRADIENT_CONFIG}
            initialTimeSeconds={GRADIENT_INITIAL_TIME}
            noise={GRADIENT_NOISE}
            radius={GRADIENT_RADIUS}
            resizeWhilePaused={resizeGradientWhilePaused}
          />
        </div>
        <div className="absolute inset-0 ring-1 ring-white/10 ring-inset" />
      </button>
    </CursorFollowLabel>
  )
}

type HeroCopyProps = {
  className?: string
  ref?: Ref<HTMLDivElement>
}

function HeroCopy({ className, ref }: HeroCopyProps) {
  return (
    <div className={className}>
      <div
        ref={ref}
        className="flex max-w-[min(48rem,calc(100vw-2.5rem))] flex-col items-start text-left"
      >
        <h1 className="flex max-w-3xl flex-col items-start gap-0 text-2xl leading-[1.02] font-medium tracking-normal md:text-4xl">
          <span>
            <MaskedWord>exploring</MaskedWord>{" "}
            <MaskedWord>
              <span
                className="font-light italic"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &amp;
              </span>
            </MaskedWord>{" "}
            <MaskedWord>building</MaskedWord>
          </span>
          <span className="mt-[-0.12em]">
            <MaskedWord className="mx-[-0.08em] px-[0.08em] align-baseline whitespace-nowrap">
              <span
                className="inline-flex items-baseline gap-[0.16em] font-light italic"
                style={{ fontFamily: "Georgia, serif" }}
              >
                <Sparkles
                  aria-hidden="true"
                  className="mb-[0.06em] size-[0.58em] stroke-[1.8]"
                />
                intelligent
              </span>
            </MaskedWord>{" "}
            <MaskedWord>systems</MaskedWord>
          </span>
        </h1>
        <p className="mt-0 flex flex-wrap items-center gap-x-[0.3em] text-base font-normal tracking-wide text-black/58">
          <MaskedWord>site</MaskedWord>
          <MaskedWord>reliability</MaskedWord>
          <MaskedWord>engineer</MaskedWord>
          <MaskedWord>at</MaskedWord>
          <MaskedWord className="self-center" contentClassName="items-center">
            <Image
              src={oracleLogo}
              alt="Oracle"
              width={20}
              height={20}
              className="size-5 translate-y-[3.5px] rounded-sm"
            />
          </MaskedWord>
          <MaskedWord>currently</MaskedWord>
        </p>
      </div>
    </div>
  )
}

function MaskedWord({
  children,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <span
      className={`my-[-0.18em] inline-block overflow-hidden py-[0.18em] ${className}`}
    >
      <span data-hero-mask-word className={`inline-flex ${contentClassName}`}>
        {children}
      </span>
    </span>
  )
}
