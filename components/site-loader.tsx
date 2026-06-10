"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { Transition } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import bengaluruImage from "@/assets/site-loader/bengaluru.jpg"
import everestImage from "@/assets/site-loader/everest.jpg"
import flamingoImage from "@/assets/site-loader/flamingo.jpg"
import kashmirImage from "@/assets/site-loader/kashmir.jpg"
import pondicherryImage from "@/assets/site-loader/pondicherry.jpg"

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
]

const introDelay = 850
const countDuration = 3300
const exitDelay = 1150
const imageRevealDuration = 0.62
const imageSequenceDuration = 2000
const websiteRevealDelay = 0.28
const imageRevealStagger = Math.max(
  (imageSequenceDuration / 1000 - imageRevealDuration - websiteRevealDelay) /
    Math.max(portraits.length, 1),
  0
)
const websiteRevealStartDelay =
  (portraits.length - 1) * imageRevealStagger +
  imageRevealDuration +
  websiteRevealDelay
const pauseImageAnimationForAnnotation = false
const windowRadiusPx = 14
const heroRadiusPx = 16
const windowRadius = "0.875rem"
const heroRadius = "1rem"
const websiteRevealDuration = 0.62
const windowExpandDuration = 0.62
const windowBottomTrim = "2.25rem"
const loaderWindowClassName =
  "absolute [--loader-hero-offset:2.75rem] [--loader-hero-pad:0.75rem] [--loader-window-height:clamp(22rem,29vw,33rem)] [--loader-window-width:clamp(14rem,18.5vw,21rem)] [--loader-window-y:-44%] md:[--loader-hero-pad:1rem] max-[720px]:[--loader-window-height:clamp(17rem,81vw,25.125rem)] max-[720px]:[--loader-window-width:clamp(10.5rem,50vw,15.5rem)] max-[720px]:[--loader-window-y:-42%]"

const loaderCells = Array.from({ length: 9 }, (_, index) => ({
  id: index,
  isOuter: index !== 4,
}))
const loaderDotColors = ["#08080a", "#2a2a2d", "#5a5a60", "#8b8b91", "#c7c7cc"]
const windowExpandTransition: Transition = {
  duration: windowExpandDuration,
  ease: [0.22, 0.61, 0.36, 1],
}

type MorphRect = {
  from: DOMRect
  to: DOMRect
}

export function SiteLoader() {
  const maskId = useId()
  const loaderWindowRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(pauseImageAnimationForAnnotation ? 100 : 0)
  const [hasStarted, setHasStarted] = useState(pauseImageAnimationForAnnotation)
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [showWebsiteWindow, setShowWebsiteWindow] = useState(false)
  const [morphRect, setMorphRect] = useState<MorphRect | null>(null)

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousHtmlScrollbarGutter =
      document.documentElement.style.scrollbarGutter
    const previousBodyOverflow = document.body.style.overflow

    document.documentElement.style.scrollbarGutter = "stable"
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.scrollbarGutter =
        previousHtmlScrollbarGutter
      document.body.style.overflow = previousBodyOverflow
    }
  }, [])

  useEffect(() => {
    portraits.forEach((portrait) => {
      const image = new window.Image()
      image.src = portrait.src
    })

    if (pauseImageAnimationForAnnotation) {
      return
    }

    let frame = 0
    let exitFrame = 0
    let startTimer = 0
    let exitTimer = 0
    let websiteWindowTimer = 0

    startTimer = window.setTimeout(() => {
      setHasStarted(true)
      websiteWindowTimer = window.setTimeout(
        () => setShowWebsiteWindow(true),
        websiteRevealStartDelay * 1000
      )

      const startedAt = performance.now()

      const updateCounter = (time: number) => {
        const progress = Math.min((time - startedAt) / countDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        setCount(Math.round(eased * 100))

        if (progress < 1) {
          frame = requestAnimationFrame(updateCounter)
        } else {
          setCount(100)
          const from = loaderWindowRef.current?.getBoundingClientRect()
          const to = document
            .querySelector("[data-hero-surface='true']")
            ?.getBoundingClientRect()

          if (from && to) {
            setMorphRect({ from, to })
          }

          exitFrame = requestAnimationFrame(() => {
            setIsExiting(true)
            window.dispatchEvent(new Event("site-loader:hero-enter"))
            exitTimer = window.setTimeout(() => {
              setIsVisible(false)
              window.dispatchEvent(new Event("site-loader:complete"))
            }, exitDelay)
          })
        }
      }

      frame = requestAnimationFrame(updateCounter)
    }, introDelay)

    return () => {
      window.clearTimeout(startTimer)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(exitFrame)
      window.clearTimeout(exitTimer)
      window.clearTimeout(websiteWindowTimer)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      id="site-loader"
      className="pointer-events-auto fixed inset-0 z-10000 overflow-hidden text-white"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,1.8rem)] left-[clamp(1.1rem,2.3vw,1.8rem)] z-20 font-sans text-[clamp(4rem,5vw,6.8rem)] leading-[0.78] font-normal tracking-normal tabular-nums max-[720px]:text-[clamp(3rem,17vw,4.4rem)]"
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

      {morphRect ? (
        <svg
          className="pointer-events-none absolute inset-0 z-8 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              <motion.rect
                fill="black"
                initial={false}
                animate={{
                  attrX: morphRect.from.left,
                  attrY: morphRect.from.top,
                  width: morphRect.from.width,
                  height: morphRect.from.height,
                  rx: windowRadiusPx,
                  ry: windowRadiusPx,
                  ...(isExiting
                    ? {
                        attrX: morphRect.to.left,
                        attrY: morphRect.to.top,
                        width: morphRect.to.width,
                        height: morphRect.to.height,
                        rx: heroRadiusPx,
                        ry: heroRadiusPx,
                      }
                    : null),
                }}
                transition={isExiting ? windowExpandTransition : { duration: 0 }}
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="black"
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : null}

      <motion.div
        key={morphRect ? "morphing-window" : "stack-window"}
        ref={loaderWindowRef}
        id="site-loader-window"
        className={`${loaderWindowClassName} z-10 will-change-[height,left,top,width]`}
        initial={
          morphRect
            ? {
                top: morphRect.from.top,
                left: morphRect.from.left,
                width: morphRect.from.width,
                height: morphRect.from.height,
                x: 0,
                y: 0,
                borderRadius: windowRadius,
              }
            : false
        }
        animate={
          isExiting
            ? morphRect
              ? {
                  top: [morphRect.from.top, morphRect.to.top],
                  left: [morphRect.from.left, morphRect.to.left],
                  width: [morphRect.from.width, morphRect.to.width],
                  height: [morphRect.from.height, morphRect.to.height],
                  x: 0,
                  y: 0,
                  borderRadius: [windowRadius, heroRadius],
                }
              : {
                  top: "50%",
                  left: "50%",
                  width: "var(--loader-window-width)",
                  height: `calc(var(--loader-window-height) - ${windowBottomTrim})`,
                  x: "-50%",
                  y: "var(--loader-window-y)",
                  borderRadius: windowRadius,
                }
            : {
                ...(morphRect
                  ? {
                      top: morphRect.from.top,
                      left: morphRect.from.left,
                      width: morphRect.from.width,
                      height: morphRect.from.height,
                      x: 0,
                      y: 0,
                    }
                  : {
                      top: "50%",
                      left: "50%",
                      width: "var(--loader-window-width)",
                      height: `calc(var(--loader-window-height) - ${windowBottomTrim})`,
                      x: "-50%",
                      y: "var(--loader-window-y)",
                    }),
                borderRadius: windowRadius,
              }
        }
        transition={isExiting ? windowExpandTransition : { duration: 0 }}
        style={{ boxShadow: isExiting ? "none" : "0 0 0 100vmax #000000" }}
      >
        <motion.div
          id="site-loader-slide-stack"
          className="relative h-full w-full origin-center overflow-hidden"
          animate={{
            opacity: isExiting ? 0 : 1,
            borderRadius: isExiting ? [windowRadius, heroRadius] : windowRadius,
          }}
          transition={
            isExiting
              ? {
                  opacity: { duration: 0.08, ease: "linear" },
                  borderRadius: windowExpandTransition,
                }
              : { duration: 0 }
          }
        >
          <motion.figure
            className="absolute inset-0 m-0 bg-black"
            style={{ zIndex: 0 }}
            animate={
              showWebsiteWindow
                ? { clipPath: "inset(0 0 100% 0)" }
                : { clipPath: "inset(0% 0 0 0)" }
            }
            transition={{
              duration: websiteRevealDuration,
              ease: [0.77, 0, 0.175, 1],
            }}
          />
          {portraits.map((portrait, index) => (
            <motion.figure
              key={portrait.src}
              className="absolute inset-0 m-0 h-full w-full overflow-hidden will-change-[clip-path,opacity]"
              style={{ zIndex: index + 1 }}
              initial={
                pauseImageAnimationForAnnotation
                  ? { opacity: 1, clipPath: "inset(0% 0 0 0)" }
                  : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
              }
              animate={
                showWebsiteWindow
                  ? { opacity: 1, clipPath: "inset(0 0 100% 0)" }
                  : hasStarted
                    ? { opacity: 1, clipPath: "inset(0% 0 0 0)" }
                    : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
              }
              transition={{
                duration: pauseImageAnimationForAnnotation
                  ? 0
                  : showWebsiteWindow
                    ? websiteRevealDuration
                    : imageRevealDuration,
                delay: showWebsiteWindow ? 0 : index * imageRevealStagger,
                ease: [0.77, 0, 0.175, 1],
              }}
            >
              <Image
                className="block h-full w-full object-cover"
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                style={{ objectFit: "cover" }}
                sizes="(max-width: 720px) 50vw, 21rem"
              />
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[clamp(1rem,2.3vw,2rem)] right-[clamp(1.1rem,2.3vw,2rem)] z-20 grid w-[clamp(2.45rem,3.1vw,3.1rem)] place-items-center max-[720px]:top-[1.05rem] max-[720px]:right-[1.05rem] max-[720px]:w-[2.45rem]"
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
          src="/monogram.svg"
          alt=""
          width={64}
          height={64}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute right-[clamp(1rem,1.8vw,1.6rem)] bottom-[clamp(1rem,1.8vw,1.6rem)] z-20 grid size-12 grid-cols-3 grid-rows-3 gap-0.5"
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
  )
}
