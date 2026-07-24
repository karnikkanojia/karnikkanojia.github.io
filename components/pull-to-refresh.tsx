"use client"

import { useCallback, useEffect, type ReactNode, useRef, useState } from "react"

const TRIGGER_DISTANCE = 96
const MAX_DISTANCE = 140
const DAMPING_DISTANCE = 110
const SETTLE_DURATION_MS = 280
const RELOAD_DELAY_MS = 850
const SKIP_INTRO_KEY = "portfolio:skip-intro-once"

type RefreshStatus = "idle" | "pulling" | "ready" | "loading"

type PullToRefreshProps = {
  children: ReactNode
  disabled?: boolean
}

export function PullToRefresh({
  children,
  disabled = false,
}: PullToRefreshProps) {
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const pullDistanceRef = useRef(0)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const reloadTimeoutRef = useRef<number | undefined>(undefined)
  const settleTimeoutRef = useRef<number | undefined>(undefined)
  const statusRef = useRef<RefreshStatus>("idle")
  const [status, setStatus] = useState<RefreshStatus>("idle")

  const updateStatus = useCallback((nextStatus: RefreshStatus) => {
    if (statusRef.current === nextStatus) return
    statusRef.current = nextStatus
    setStatus(nextStatus)
  }, [])

  const clearSettleTimeout = () => {
    if (settleTimeoutRef.current === undefined) return
    window.clearTimeout(settleTimeoutRef.current)
    settleTimeoutRef.current = undefined
  }

  const setSurfacePosition = useCallback(
    (distance: number, animated = false) => {
      const surface = surfaceRef.current
      const transition = animated
        ? `transform ${SETTLE_DURATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`
        : "none"
      const transform = `translate3d(0, ${distance}px, 0)`
      const navbar = document.querySelector<HTMLElement>("[data-site-navbar]")

      if (surface) {
        surface.style.willChange = "transform"
        surface.style.transition = transition
        surface.style.transform = transform
      }
      if (navbar) {
        navbar.style.willChange = "translate"
        navbar.style.transition = animated
          ? `translate ${SETTLE_DURATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`
          : "none"
        navbar.style.translate = `0 ${distance}px`
      }
      if (orbitRef.current && statusRef.current !== "loading") {
        const progress = Math.min(distance / TRIGGER_DISTANCE, 1)
        orbitRef.current.style.transform = `translateX(-50%) rotate(${progress * 42}deg) scale(${0.88 + progress * 0.12})`
      }
    },
    []
  )

  const settleClosed = useCallback(() => {
    clearSettleTimeout()
    pullDistanceRef.current = 0
    setSurfacePosition(0, true)

    settleTimeoutRef.current = window.setTimeout(() => {
      const surface = surfaceRef.current
      if (surface) {
        surface.style.removeProperty("transform")
        surface.style.removeProperty("transition")
        surface.style.removeProperty("will-change")
      }
      const navbar = document.querySelector<HTMLElement>("[data-site-navbar]")
      if (navbar) {
        navbar.style.removeProperty("translate")
        navbar.style.removeProperty("transition")
        navbar.style.removeProperty("will-change")
      }
      if (orbitRef.current) {
        orbitRef.current.style.removeProperty("transform")
      }
      updateStatus("idle")
      settleTimeoutRef.current = undefined
    }, SETTLE_DURATION_MS)
  }, [setSurfacePosition, updateStatus])

  useEffect(() => {
    let mouseGestureActive = false

    const canStartGesture = () =>
      !(
        disabled ||
        statusRef.current === "loading" ||
        document.documentElement.dataset.siteIntroComplete !== "true" ||
        window.scrollY > 0 ||
        !window.matchMedia("(max-width: 767px)").matches
      )

    const startGesture = (clientX: number, clientY: number) => {
      if (!canStartGesture()) return false
      clearSettleTimeout()
      startRef.current = { x: clientX, y: clientY }
      updateStatus("pulling")
      return true
    }

    const moveGesture = (
      clientX: number,
      clientY: number,
      preventDefault: () => void
    ) => {
      const start = startRef.current
      if (!start || disabled || statusRef.current === "loading") return

      const deltaY = clientY - start.y
      const deltaX = clientX - start.x
      if (deltaY <= 0 || Math.abs(deltaX) > deltaY || window.scrollY > 0) {
        startRef.current = null
        settleClosed()
        return
      }

      preventDefault()
      const distance = MAX_DISTANCE * (1 - Math.exp(-deltaY / DAMPING_DISTANCE))
      pullDistanceRef.current = distance
      setSurfacePosition(distance)
      updateStatus(distance >= TRIGGER_DISTANCE ? "ready" : "pulling")
    }

    const finishGesture = () => {
      startRef.current = null
      if (statusRef.current === "loading") return

      if (pullDistanceRef.current >= TRIGGER_DISTANCE) {
        updateStatus("loading")
        setSurfacePosition(TRIGGER_DISTANCE, true)
        try {
          window.sessionStorage.setItem(SKIP_INTRO_KEY, "true")
        } catch {
          // The refresh still works when storage is unavailable.
        }
        reloadTimeoutRef.current = window.setTimeout(
          () => window.location.reload(),
          RELOAD_DELAY_MS
        )
        return
      }

      settleClosed()
    }

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      const touch = event.touches[0]
      startGesture(touch.clientX, touch.clientY)
    }

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      const touch = event.touches[0]
      moveGesture(touch.clientX, touch.clientY, () => event.preventDefault())
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) finishGesture()
    }

    const onTouchCancel = () => {
      startRef.current = null
      if (statusRef.current !== "loading") settleClosed()
    }

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return
      mouseGestureActive = startGesture(event.clientX, event.clientY)
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!mouseGestureActive) return
      moveGesture(event.clientX, event.clientY, () => event.preventDefault())
    }

    const onMouseUp = () => {
      if (!mouseGestureActive) return
      mouseGestureActive = false
      finishGesture()
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd, { passive: true })
    document.addEventListener("touchcancel", onTouchCancel, { passive: true })
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)

    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
      document.removeEventListener("touchcancel", onTouchCancel)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      clearSettleTimeout()
      const navbar = document.querySelector<HTMLElement>("[data-site-navbar]")
      if (navbar) {
        navbar.style.removeProperty("translate")
        navbar.style.removeProperty("transition")
        navbar.style.removeProperty("will-change")
      }
      if (reloadTimeoutRef.current !== undefined) {
        window.clearTimeout(reloadTimeoutRef.current)
      }
    }
  }, [disabled, setSurfacePosition, settleClosed, updateStatus])

  return (
    <div className="relative isolate z-10">
      <div
        data-pull-refresh-underlay
        className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-40 overflow-hidden bg-[#090909] text-white md:hidden ${
          status === "idle" ? "invisible opacity-0" : "visible opacity-100"
        }`}
        role="status"
        aria-live="polite"
        aria-label={
          status === "loading"
            ? "Refreshing site"
            : status === "ready"
              ? "Release to refresh site"
              : "Pull to refresh site"
        }
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.75%,rgba(255,255,255,0.08)_50%,transparent_50.25%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:100%_100%,100%_16px]" />
        <div
          ref={orbitRef}
          className={`absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full border border-white/25 will-change-transform ${
            status === "loading" ? "pull-refresh-orbit" : ""
          }`}
          aria-hidden="true"
        >
          <div className="absolute inset-5 rounded-full border border-white/12" />
          <div className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          <div className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full bg-white" />
        </div>
        <div className="absolute inset-x-0 top-2.5 flex items-center justify-between px-5 font-navbar text-[9px] leading-none tracking-[0.17em] uppercase">
          <span className="text-white/48">Pull down</span>
          <span className="text-white/48">Refresh</span>
        </div>
        <div className="absolute inset-x-0 top-[4.35rem] text-center font-navbar text-[10px] leading-none tracking-[0.2em] uppercase">
          {status === "loading"
            ? "Refreshing"
            : status === "ready"
              ? "Release"
              : "Keep pulling"}
        </div>
      </div>

      <div
        ref={surfaceRef}
        data-pull-refresh-surface
        className="relative z-10 min-h-screen bg-white"
      >
        {children}
      </div>
    </div>
  )
}
