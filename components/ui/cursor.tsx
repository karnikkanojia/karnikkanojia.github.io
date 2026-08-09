"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, useEffect, useRef } from "react"

export type CursorProps = {
  children: ReactNode
  className?: string
  onPositionChange?: (x: number, y: number) => void
}

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

export function Cursor({
  children,
  className,
  onPositionChange,
}: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const finePointer = window.matchMedia(FINE_POINTER_QUERY)
    let frame: number | undefined
    let pointerX = 0
    let pointerY = 0

    const setVisible = (visible: boolean) => {
      cursor.dataset.visible = String(visible)
    }

    const renderPosition = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`
      onPositionChange?.(pointerX, pointerY)
      frame = undefined
    }

    const moveCursor = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return

      pointerX = event.clientX
      pointerY = event.clientY
      setVisible(true)
      if (frame === undefined) frame = requestAnimationFrame(renderPosition)
    }

    const hideCursor = () => setVisible(false)

    const handlePointerChange = () => {
      if (!finePointer.matches) setVisible(false)
    }

    window.addEventListener("pointermove", moveCursor, { passive: true })
    document.documentElement.addEventListener("pointerleave", hideCursor)
    finePointer.addEventListener("change", handlePointerChange)

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", moveCursor)
      document.documentElement.removeEventListener("pointerleave", hideCursor)
      finePointer.removeEventListener("change", handlePointerChange)
    }
  }, [onPositionChange])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-motion-cursor
      data-visible="false"
      className={cn("pointer-events-none fixed top-0 left-0 z-[9999]", className)}
    >
      {children}
    </div>
  )
}
