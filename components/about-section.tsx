"use client"

import { ArrowLeft, ArrowRight, Plane } from "lucide-react"
import {
  animate,
  cubicBezier,
  set,
  splitText,
  stagger,
  type JSAnimation,
} from "animejs"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { CursorImageTrail } from "@/components/ui/cursor-image-trail"

const stats = ["2", "BLR → NYU"] as const

const aboutCopy =
  "I focus on building reliable systems at the intersection of artificial intelligence and healthcare. I am drawn to problems where accuracy, trust, and real-world deployment are as critical as the underlying models. My approach emphasizes understanding constraints, designing for robustness, and developing technologies that clinicians and patients can depend on with confidence."

const aboutActionVerbs = new Set([
  "reliable",
  "healthcare.",
  "robustness",
  "clinicians",
  "patients",
])

const trailImages = [
  "/images/cursor-trail/mouse1.webp",
  "/images/cursor-trail/mouse2.webp",
  "/images/cursor-trail/mouse3.webp",
  "/images/cursor-trail/mouse4.webp",
  "/images/cursor-trail/mouse6.webp",
  "/images/cursor-trail/mouse7.webp",
  "/images/cursor-trail/mouse8.webp",
  "/images/cursor-trail/mouse9.webp",
  "/images/cursor-trail/mouse11.webp",
  "/images/cursor-trail/mouse12.webp",
]
const CURSOR_TRAIL_ENABLED = false

type MaskedRevealOptions = {
  enterDuration?: number
  exitDuration?: number
  enterStagger?: number
  exitStagger?: number
}

function observeMaskedReveal(
  trigger: HTMLElement,
  targets: HTMLElement[],
  {
    enterDuration = 620,
    exitDuration = 320,
    enterStagger = 24,
    exitStagger = 8,
  }: MaskedRevealOptions = {}
) {
  let animation: JSAnimation | null = null
  let isRevealed = false

  // Seed Anime.js's own transform state. The stylesheet keeps the split words
  // masked before hydration, but Anime.js does not read that external
  // translateY value into its transform cache. Without this, the first
  // 115% -> 0% reveal is treated as 0% -> 0% and snaps in instantly.
  set(targets, { y: "115%" })

  const animateTargets = (reveal: boolean) => {
    if (reveal === isRevealed) return

    animation?.cancel()
    isRevealed = reveal

    animation = animate(targets, {
      y: reveal ? "0%" : "115%",
      duration: reveal ? enterDuration : exitDuration,
      delay: reveal
        ? stagger(enterStagger)
        : stagger(exitStagger, { from: "last" }),
      ease: cubicBezier(0.23, 1, 0.32, 1),
      composition: "replace",
    })
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      const rootTop = entry.rootBounds?.top ?? 0

      if (entry.intersectionRatio >= 0.2) {
        animateTargets(true)
      } else if (entry.boundingClientRect.top > rootTop) {
        animateTargets(false)
      }
    },
    { threshold: [0, 0.2] }
  )

  const startObserving = () => observer.observe(trigger)

  // The intro overlays the page while the About section mounts. Waiting until
  // it has finished prevents its initial layout pass from consuming this
  // reveal before the visitor can actually scroll to the section.
  if (document.documentElement.dataset.siteIntroComplete === "true") {
    startObserving()
  } else {
    window.addEventListener("site-loader:complete", startObserving, {
      once: true,
    })
  }

  return () => {
    observer.disconnect()
    window.removeEventListener("site-loader:complete", startObserving)
    animation?.cancel()
  }
}

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const copyRef = useRef<HTMLParagraphElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)
  const signatureCopyRef = useRef<HTMLParagraphElement>(null)
  const signatureImageRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const copy = copyRef.current
    if (!copy) return

    const split = splitText(copy, {
      words: { wrap: "clip", class: "about-copy-word" },
    })

    split.words.forEach((word) => {
      if (aboutActionVerbs.has(word.textContent?.trim() ?? "")) {
        word.classList.add("about-action-verb")
      }
    })

    const stopReveal = observeMaskedReveal(copy, split.words)

    return () => {
      stopReveal()
      split.revert()
    }
  }, [])

  useLayoutEffect(() => {
    const signature = signatureRef.current
    const signatureCopy = signatureCopyRef.current
    const signatureImage = signatureImageRef.current
    if (!signature || !signatureCopy || !signatureImage) return

    const split = splitText(signatureCopy, {
      words: { wrap: "clip", class: "about-signature-word" },
    })
    const stopReveal = observeMaskedReveal(
      signature,
      [signatureImage, ...split.words],
      {
        enterDuration: 520,
        exitDuration: 280,
        enterStagger: 32,
        exitStagger: 8,
      }
    )

    return () => {
      stopReveal()
      split.revert()
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % stats.length)
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [activeIndex])

  function changeStatement(direction: 1 | -1) {
    setActiveIndex(
      (current) => (current + direction + stats.length) % stats.length
    )
  }

  return (
    <CursorImageTrail
      items={trailImages}
      itemSize={112}
      trailLength={CURSOR_TRAIL_ENABLED ? 6 : 0}
      spawnDistance={72}
      rotationRange={12}
      className="bg-white px-8 pt-24 pb-10 text-black md:px-10 md:pt-32 md:pb-12 lg:px-12"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(17rem,31%)_minmax(0,1fr)] lg:gap-0">
        <aside className="flex flex-col lg:pr-12">
          <div aria-hidden="true" className="flex h-px w-full gap-1">
            <span className="relative block h-px min-w-0 flex-1 overflow-hidden bg-black/20">
              {activeIndex === 0 && (
                <span
                  key={`about-progress-${activeIndex}`}
                  className="block h-full bg-black"
                  style={{
                    width: 0,
                    animation: "about-stat-progress 3.5s linear forwards",
                  }}
                />
              )}
            </span>
            <span className="relative block h-px min-w-0 flex-1 overflow-hidden bg-black/20">
              {activeIndex === 1 && (
                <span
                  key={`about-progress-${activeIndex}`}
                  className="block h-full bg-black"
                  style={{
                    width: 0,
                    animation: "about-stat-progress 3.5s linear forwards",
                  }}
                />
              )}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeStatement(-1)}
                aria-label="Previous about statement"
                className="grid size-5 place-items-center text-black hover:text-black/55"
              >
                <ArrowLeft aria-hidden="true" size={17} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                onClick={() => changeStatement(1)}
                aria-label="Next about statement"
                className="grid size-5 place-items-center text-black hover:text-black/55"
              >
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.25} />
              </button>
            </div>
            <p className="font-navbar text-xs tracking-[0.08em] text-black/55">
              {String(activeIndex + 1).padStart(2, "0")}.
              {String(stats.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-3 lg:mt-4">
            <div aria-live="polite">
              {activeIndex === 0 ? (
                <p className="text-2xl leading-none font-medium tracking-[-0.07em] md:text-4xl">
                  {stats[0]}
                </p>
              ) : (
                <div
                  role="img"
                  aria-label="Boarding pass for flight AI101 from Bengaluru at 23:10 to New York at 09:40 the following day, gate 12A, seat 21F"
                  className="flex w-full max-w-60 overflow-hidden rounded-md border border-black/20"
                >
                  <div className="min-w-0 flex-1 px-3 py-2">
                    <div className="flex items-center justify-between font-navbar text-xs leading-none tracking-widest text-black/50 uppercase">
                      <span className="inline-flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="block size-3 shrink-0 bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://www.google.com/s2/favicons?domain=airindia.com&sz=64")',
                          }}
                        />
                        <span>AI101</span>
                      </span>
                      <span>23.10 - 09.40</span>
                    </div>
                    <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                      <span className="text-xl leading-none font-medium tracking-[-0.04em]">
                        BLR
                      </span>
                      <span className="flex min-w-0 items-center gap-1 text-black/45">
                        <span className="h-px flex-1 border-t border-dashed border-black/30" />
                        <Plane aria-hidden="true" size={10} strokeWidth={1.8} />
                        <span className="h-px flex-1 border-t border-dashed border-black/30" />
                      </span>
                      <span className="text-xl leading-none font-medium tracking-[-0.04em]">
                        NYC
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {activeIndex === 0 ? (
              <p className="mt-2.5 max-w-52 text-base leading-[1.32] text-black/55">
                Years building dependable systems across healthcare and applied
                research.
              </p>
            ) : (
              <p className="mt-2.5 max-w-52 text-base leading-[1.32] text-black/55">
                New York bound for NYU&rsquo;s MS in Data Science.
              </p>
            )}
          </div>
        </aside>

        <div className="flex flex-col lg:pl-[7.2vw]">
          <div>
            <h2 className="sr-only">About Karnik Kanojia</h2>
            <p
              ref={copyRef}
              className="max-w-[36ch] text-2xl leading-[1.08] tracking-[-0.035em] text-pretty md:text-4xl"
            >
              {aboutCopy}
            </p>
          </div>

          <div
            ref={signatureRef}
            className="mt-12 flex items-center gap-3 lg:mt-14"
          >
            <span className="block size-10 shrink-0 overflow-hidden rounded-full">
              <span
                ref={signatureImageRef}
                className="about-signature-image block size-full overflow-hidden rounded-full border border-black/20"
              >
                <Image
                  src="/images/profile/karnik-linkedin.webp"
                  alt="Karnik Kanojia"
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </span>
            </span>
            <p
              ref={signatureCopyRef}
              className="word-spacing-[-0.1em] font-navbar text-xs leading-[1.05] text-black/60"
            >
              KARNIK KANOJIA
              <span className="block">SITE RELIABILITY ENGINEER</span>
            </p>
          </div>
        </div>
      </div>
    </CursorImageTrail>
  )
}
