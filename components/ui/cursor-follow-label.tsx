"use client"

import { cn } from "@/lib/utils"
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

const VIEWPORT_PADDING = 12

type CursorFollowLabelProps = {
  as?: "div" | "span"
  children: ReactNode
  className?: string
  icon?: ReactNode
  label: ReactNode
  labelClassName?: string
  offset?: { x: number; y: number }
  showLabel?: boolean
  followStrength?: number
}

export function CursorFollowLabel({
  as: Component = "div",
  children,
  className,
  icon,
  label,
  labelClassName,
  offset = { x: 10, y: 10 },
  showLabel = true,
  followStrength = 0.22,
}: CursorFollowLabelProps) {
  const positionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | undefined>(undefined)
  const currentRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const labelSizeRef = useRef({ width: 0, height: 0 })
  const viewportSizeRef = useRef({ width: 0, height: 0 })
  const isHoveringRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  const positionLabel = useCallback(
    (pointerX: number, pointerY: number) => {
      const position = positionRef.current
      const label = labelRef.current
      if (!position || !label) return

      const { width: labelWidth, height: labelHeight } = labelSizeRef.current
      const { width: viewportWidth, height: viewportHeight } =
        viewportSizeRef.current
      const preferredX = pointerX + offset.x
      const shouldFlipLeft =
        preferredX + labelWidth > viewportWidth - VIEWPORT_PADDING
      const nextX = shouldFlipLeft
        ? Math.max(VIEWPORT_PADDING, pointerX - offset.x - labelWidth)
        : Math.max(VIEWPORT_PADDING, preferredX)
      const nextY = Math.max(
        VIEWPORT_PADDING,
        Math.min(
          Math.max(VIEWPORT_PADDING, pointerY + offset.y),
          viewportHeight - labelHeight - VIEWPORT_PADDING
        )
      )

      position.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`
      label.style.transformOrigin = shouldFlipLeft ? "top right" : "top left"
    },
    [offset.x, offset.y]
  )

  useEffect(() => {
    const mountFrame = requestAnimationFrame(() => setMounted(true))
    return () => {
      cancelAnimationFrame(mountFrame)
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    const updateViewportSize = () => {
      viewportSizeRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      if (isHoveringRef.current) {
        positionLabel(currentRef.current.x, currentRef.current.y)
      }
    }

    updateViewportSize()
    window.addEventListener("resize", updateViewportSize)
    return () => window.removeEventListener("resize", updateViewportSize)
  }, [positionLabel])

  useEffect(() => {
    const labelElement = labelRef.current
    if (!mounted || !labelElement) return

    const updateLabelSize = () => {
      labelSizeRef.current = {
        width: labelElement.offsetWidth,
        height: labelElement.offsetHeight,
      }
      if (isHoveringRef.current) {
        positionLabel(currentRef.current.x, currentRef.current.y)
      }
    }

    updateLabelSize()
    const observer = new ResizeObserver(updateLabelSize)
    observer.observe(labelElement)
    return () => observer.disconnect()
  }, [mounted, positionLabel])

  useEffect(() => {
    if (!labelRef.current || !isHoveringRef.current) return
    labelRef.current.style.opacity = showLabel ? "1" : "0"
    labelRef.current.style.transform = showLabel ? "scale(1)" : "scale(0.96)"
  }, [showLabel])

  const renderPosition = () => {
    const current = currentRef.current
    const target = targetRef.current
    const strength = Math.min(1, Math.max(0.01, followStrength))
    current.x += (target.x - current.x) * strength
    current.y += (target.y - current.y) * strength

    positionLabel(current.x, current.y)

    if (
      Math.abs(target.x - current.x) > 0.1 ||
      Math.abs(target.y - current.y) > 0.1
    ) {
      frameRef.current = requestAnimationFrame(renderPosition)
    } else {
      frameRef.current = undefined
    }
  }

  const moveToPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    targetRef.current = { x: event.clientX, y: event.clientY }
    if (!isHoveringRef.current) {
      isHoveringRef.current = true
      currentRef.current = targetRef.current
      positionLabel(event.clientX, event.clientY)
      if (labelRef.current) {
        labelRef.current.style.opacity = showLabel ? "1" : "0"
        labelRef.current.style.transform = showLabel
          ? "scale(1)"
          : "scale(0.96)"
      }
    }
    if (frameRef.current === undefined) {
      frameRef.current = requestAnimationFrame(renderPosition)
    }
  }

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    isHoveringRef.current = true
    currentRef.current = { x: event.clientX, y: event.clientY }
    targetRef.current = currentRef.current
    positionLabel(event.clientX, event.clientY)
    if (labelRef.current) {
      labelRef.current.style.opacity = showLabel ? "1" : "0"
      labelRef.current.style.transform = showLabel ? "scale(1)" : "scale(0.96)"
    }
  }

  const hideLabel = () => {
    isHoveringRef.current = false
    if (labelRef.current) {
      labelRef.current.style.opacity = "0"
      labelRef.current.style.transform = "scale(0.96)"
    }
  }

  return (
    <Component
      className={cn("cursor-follow-target", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={hideLabel}
      onPointerMove={moveToPointer}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={positionRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[200] will-change-transform"
          >
            <div
              ref={labelRef}
              className={cn(
                "inline-flex max-w-[calc(100vw-24px)] origin-top-left scale-[0.96] items-center gap-1.5 bg-[#dddddd] px-3 py-1.5 font-navbar text-[10px] leading-none font-light tracking-wide text-black uppercase opacity-0 shadow-[0_6px_20px_rgb(0_0_0/0.12)] transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [&_span]:min-w-0 [&_svg]:size-2.5 [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
                labelClassName
              )}
            >
              {icon}
              <span className="translate-y-[0.5px]">{label}</span>
            </div>
          </div>,
          document.body
        )}
    </Component>
  )
}
