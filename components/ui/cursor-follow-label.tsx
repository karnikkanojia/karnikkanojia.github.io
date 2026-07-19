"use client"

import { cn } from "@/lib/utils"
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

type CursorFollowLabelProps = {
  children: ReactNode
  className?: string
  icon?: ReactNode
  label: ReactNode
  labelClassName?: string
  offset?: { x: number; y: number }
  showLabel?: boolean
}

export function CursorFollowLabel({
  children,
  className,
  icon,
  label,
  labelClassName,
  offset = { x: 10, y: 10 },
  showLabel = true,
}: CursorFollowLabelProps) {
  const positionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | undefined>(undefined)
  const currentRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountFrame = requestAnimationFrame(() => setMounted(true))
    return () => {
      cancelAnimationFrame(mountFrame)
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!labelRef.current || !isHoveringRef.current) return
    labelRef.current.style.opacity = showLabel ? "1" : "0"
    labelRef.current.style.transform = showLabel ? "scale(1)" : "scale(0.96)"
  }, [showLabel])

  const renderPosition = () => {
    const current = currentRef.current
    const target = targetRef.current
    current.x += (target.x - current.x) * 0.22
    current.y += (target.y - current.y) * 0.22

    if (positionRef.current) {
      positionRef.current.style.transform = `translate3d(${current.x + offset.x}px, ${current.y + offset.y}px, 0)`
    }

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
    if (frameRef.current === undefined) {
      frameRef.current = requestAnimationFrame(renderPosition)
    }
  }

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    isHoveringRef.current = true
    currentRef.current = { x: event.clientX, y: event.clientY }
    targetRef.current = currentRef.current
    if (positionRef.current) {
      positionRef.current.style.transform = `translate3d(${event.clientX + offset.x}px, ${event.clientY + offset.y}px, 0)`
    }
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
    <div
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
                "inline-flex origin-top-left scale-[0.96] items-center gap-1.5 bg-[#dddddd] px-3 py-1.5 font-navbar text-[10px] leading-none font-light tracking-wide text-black uppercase opacity-0 shadow-[0_6px_20px_rgb(0_0_0/0.12)] transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [&_svg]:size-2.5 [&_svg]:stroke-[1.5]",
                labelClassName
              )}
            >
              {icon}
              <span className="translate-y-[0.5px]">{label}</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
