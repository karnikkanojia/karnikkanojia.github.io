"use client"

import { type ReactNode, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const REVEAL_END_VIEWPORT_RATIO = 0.28
const DESKTOP_QUERY = "(min-width: 768px)"
const FRAME_SEPARATION_RESPONSES = [30, 40] as const
const FRAME_CONVERGENCE_RESPONSES = [7, 10] as const
const DESKTOP_FRAME_OFFSETS = [192, 112] as const
const MOBILE_FRAME_OFFSETS = [120, 72] as const
const MOMENTUM_FULL_SPEED = 650
const MOMENTUM_DECAY = 2.2

type BlogFooterTransitionProps = {
  children: ReactNode
}

export function BlogFooterTransition({ children }: BlogFooterTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const amberFrameRef = useRef<HTMLDivElement>(null)
  const coralFrameRef = useRef<HTMLDivElement>(null)
  const [frameLayerReady, setFrameLayerReady] = useState(false)

  useLayoutEffect(() => {
    const frameId = window.requestAnimationFrame(() => setFrameLayerReady(true))
    return () => window.cancelAnimationFrame(frameId)
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const amberFrame = amberFrameRef.current
    const coralFrame = coralFrameRef.current
    const footer = document.querySelector<HTMLElement>("#contact")

    if (!section || !amberFrame || !coralFrame || !footer) return

    const desktop = window.matchMedia(DESKTOP_QUERY)
    let frameId: number | undefined
    let previousTime: number | undefined
    let previousScrollY = window.scrollY
    let momentum = 0
    let amberOffset = 0
    let coralOffset = 0

    const render = (time: number) => {
      frameId = undefined

      const deltaSeconds =
        previousTime === undefined
          ? 1 / 60
          : Math.min(0.05, Math.max(1 / 240, (time - previousTime) / 1000))
      previousTime = time

      const scrollDelta = window.scrollY - previousScrollY
      previousScrollY = window.scrollY
      if (Math.abs(scrollDelta) > 0.1) {
        const measuredMomentum = Math.min(
          1,
          Math.abs(scrollDelta) / (deltaSeconds * MOMENTUM_FULL_SPEED)
        )
        const momentumImpulse = Math.pow(measuredMomentum, 0.45)
        momentum = Math.max(momentum, momentumImpulse)
      } else {
        momentum *= Math.exp(-MOMENTUM_DECAY * deltaSeconds)
      }

      const footerTop = footer.getBoundingClientRect().top
      const sectionBounds = section.getBoundingClientRect()
      const revealDistance = Math.max(
        1,
        window.innerHeight * (1 - REVEAL_END_VIEWPORT_RATIO)
      )
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - footerTop) / revealDistance)
      )
      const easedProgress = progress * progress * (3 - 2 * progress)
      const separation = 1 - easedProgress
      const motionDrive = momentum
      const [maxAmberOffset, maxCoralOffset] = desktop.matches
        ? DESKTOP_FRAME_OFFSETS
        : MOBILE_FRAME_OFFSETS
      const amberTarget = maxAmberOffset * motionDrive * separation
      const coralTarget = maxCoralOffset * motionDrive * separation

      const amberResponse =
        amberTarget > amberOffset
          ? FRAME_SEPARATION_RESPONSES[0]
          : FRAME_CONVERGENCE_RESPONSES[0]
      const coralResponse =
        coralTarget > coralOffset
          ? FRAME_SEPARATION_RESPONSES[1]
          : FRAME_CONVERGENCE_RESPONSES[1]
      const amberFollow = 1 - Math.exp(-amberResponse * deltaSeconds)
      const coralFollow = 1 - Math.exp(-coralResponse * deltaSeconds)
      amberOffset += (amberTarget - amberOffset) * amberFollow
      coralOffset += (coralTarget - coralOffset) * coralFollow

      const isMoving =
        Math.abs(amberTarget - amberOffset) > 0.01 ||
        Math.abs(coralTarget - coralOffset) > 0.01
      const hasMomentum = momentum > 0.0001
      if (!isMoving && !hasMomentum) {
        momentum = 0
        amberOffset = 0
        coralOffset = 0
      }

      amberFrame.style.transform = "translate3d(0, 0, 0)"
      coralFrame.style.transform = "translate3d(0, 0, 0)"
      const coralHeight = Math.min(coralOffset, amberOffset)
      const amberHeight = Math.max(0, amberOffset - coralHeight)
      const coralTop = `${sectionBounds.bottom}px`
      const amberTop = `${sectionBounds.bottom + coralHeight}px`
      const frameWidth = `${sectionBounds.width}px`
      const frameLeft = `${sectionBounds.left}px`

      for (const frame of [amberFrame, coralFrame]) {
        frame.style.left = frameLeft
        frame.style.width = frameWidth
      }
      amberFrame.style.top = amberTop
      amberFrame.style.height = `${amberHeight}px`
      coralFrame.style.top = coralTop
      coralFrame.style.height = `${coralHeight}px`

      const isActive = isMoving || hasMomentum
      amberFrame.style.willChange = isActive ? "height" : "auto"
      coralFrame.style.willChange = isActive ? "height" : "auto"

      if (isMoving || hasMomentum) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    const requestRender = () => {
      if (frameId === undefined) frameId = window.requestAnimationFrame(render)
    }

    window.addEventListener("scroll", requestRender, { passive: true })
    window.addEventListener("resize", requestRender)
    desktop.addEventListener("change", requestRender)
    frameId = window.requestAnimationFrame(render)

    return () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", requestRender)
      window.removeEventListener("resize", requestRender)
      desktop.removeEventListener("change", requestRender)
    }
  }, [frameLayerReady])

  return (
    <>
      <section
        ref={sectionRef}
        id="blogs"
        className="relative z-10 flex min-h-0 scroll-mt-12 items-start overflow-visible rounded-[0.625rem] text-black"
      >
        <div className="relative z-2 w-full rounded-[0.625rem] bg-white px-5 py-8 md:px-8 md:py-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </section>
      {frameLayerReady &&
        createPortal(
          <>
            <div
              ref={amberFrameRef}
              aria-hidden="true"
              className="pointer-events-none fixed z-20 bg-[#fff68a]"
            />
            <div
              ref={coralFrameRef}
              aria-hidden="true"
              className="pointer-events-none fixed z-21 bg-[#ff886b]"
            />
          </>,
          document.body
        )}
    </>
  )
}
