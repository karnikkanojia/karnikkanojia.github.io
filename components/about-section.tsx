"use client"

import { ArrowLeft, ArrowRight, Plane } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { CursorImageTrail } from "@/components/ui/cursor-image-trail"

const stats = ["2", "BLR → NYU"] as const

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

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const copyRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const copy = copyRef.current
    if (!copy) return

    let frameId: number | undefined

    const updateReveal = () => {
      frameId = undefined
      const { top, height } = copy.getBoundingClientRect()
      const revealStart = window.innerHeight * 0.98
      const postVisibilityOffset = Math.min(160, window.innerHeight * 0.18)
      const revealEnd = window.innerHeight - height - postVisibilityOffset
      const progress = Math.min(
        1,
        Math.max(0, (revealStart - top) / (revealStart - revealEnd))
      )
      const easedProgress = Math.pow(progress, 1.35)

      copy.style.setProperty("--about-copy-reveal", `${easedProgress * 100}%`)
      copy.toggleAttribute("data-reveal-complete", progress === 1)
    }

    const requestRevealUpdate = () => {
      if (frameId === undefined) {
        frameId = requestAnimationFrame(updateReveal)
      }
    }

    requestRevealUpdate()
    window.addEventListener("scroll", requestRevealUpdate, { passive: true })
    window.addEventListener("resize", requestRevealUpdate)

    return () => {
      window.removeEventListener("scroll", requestRevealUpdate)
      window.removeEventListener("resize", requestRevealUpdate)
      if (frameId !== undefined) cancelAnimationFrame(frameId)
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
      trailLength={6}
      spawnDistance={72}
      rotationRange={12}
      className="bg-white px-5 pt-24 pb-10 text-black md:px-8 md:pt-32 md:pb-12 lg:px-5"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(17rem,31%)_minmax(0,1fr)] lg:gap-0">
        <aside className="flex flex-col lg:pr-12">
          <div
            aria-hidden="true"
            className="flex h-px w-full gap-1"
          >
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
            <p className="font-navbar text-[0.65rem] tracking-[0.08em] text-black/55">
              {String(activeIndex + 1).padStart(2, "0")}.
              {String(stats.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-3 lg:mt-4">
            <div aria-live="polite">
              {activeIndex === 0 ? (
                <p className="text-[clamp(2.35rem,3vw,3.05rem)] leading-none font-medium tracking-[-0.07em]">
                  {stats[0]}
                </p>
              ) : (
                <div
                  role="img"
                  aria-label="Boarding pass for flight AI101 from Bengaluru at 23:10 to New York at 09:40 the following day, gate 12A, seat 21F"
                  className="flex w-full max-w-60 overflow-hidden rounded-md border border-black/20"
                >
                  <div className="min-w-0 flex-1 px-3 py-2">
                    <div className="flex items-center justify-between font-navbar text-[0.5rem] leading-none tracking-[0.1em] text-black/50 uppercase">
                      <span className="inline-flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="block size-3 shrink-0 bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://www.google.com/s2/favicons?domain=airindia.com&sz=64")',
                          }}
                        />
                        <span>
                          AI101
                        </span>
                      </span>
                      <span>
                        23.10 - 09.40
                      </span>
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
              <p className="mt-2.5 max-w-[13rem] text-sm leading-[1.32] text-black/55 md:text-base">
                Years building dependable systems across healthcare and applied
                research.
              </p>
            ) : (
              <p className="mt-2.5 max-w-[13rem] text-sm leading-[1.32] text-black/55 md:text-base">
                New York bound for NYU&rsquo;s MS in Data Science.
              </p>
            )}
          </div>
        </aside>

        <div className="flex flex-col lg:pl-[7.2vw]">
          <div className="about-section-copy">
            <h2 className="sr-only">About Karnik Kanojia</h2>
            <p
              ref={copyRef}
              className="about-copy-reveal max-w-[30ch] text-pretty text-[clamp(1.9rem,2vw,3.25rem)] leading-[1.08] tracking-[-0.035em]"
            >
              I focus on building reliable systems at the intersection of
              artificial intelligence and healthcare. I am drawn to problems
              where accuracy, trust, and real-world deployment are as critical
              as the underlying models. My approach emphasizes understanding
              constraints, designing for robustness, and developing
              technologies that clinicians and patients can depend on with
              confidence.
            </p>
          </div>

          <div className="mt-12 flex items-center gap-3 lg:mt-14">
            <Image
              src="/images/profile/karnik-linkedin.webp"
              alt="Karnik Kanojia"
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full border border-black/20 object-cover"
            />
            <p className="font-navbar text-xs leading-[1.05] text-black/60 word-spacing-[-0.1em]">
              KARNIK KANOJIA
              <span className="block">SITE RELIABILITY ENGINEER</span>
            </p>
          </div>
        </div>
      </div>
    </CursorImageTrail>
  )
}
