"use client"

import { useEffect, useRef } from "react"

export function BlendCursor() {
  const cursorRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`
      cursor.dataset.visible = "true"
    }

    const hideCursor = () => {
      cursor.dataset.visible = "false"
    }

    window.addEventListener("pointermove", moveCursor, { passive: true })
    document.documentElement.addEventListener("pointerleave", hideCursor)

    return () => {
      window.removeEventListener("pointermove", moveCursor)
      document.documentElement.removeEventListener("pointerleave", hideCursor)
    }
  }, [])

  return (
    <svg
      ref={cursorRef}
      aria-hidden="true"
      data-blend-cursor
      data-visible="false"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="7" fill="currentColor" />
    </svg>
  )
}
