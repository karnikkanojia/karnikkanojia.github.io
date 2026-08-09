"use client"

import { useCursorProvider } from "@/components/cursor-provider"
import { cn } from "@/lib/utils"
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react"

type CursorFollowLabelProps = {
  as?: "div" | "span"
  children: ReactNode
  className?: string
  icon?: ReactNode
  label: ReactNode
  labelClassName?: string
  showLabel?: boolean
}

export function CursorFollowLabel({
  as: Component = "div",
  children,
  className,
  icon,
  label,
  labelClassName,
  showLabel = true,
}: CursorFollowLabelProps) {
  const id = useId()
  const isHoveringRef = useRef(false)
  const { activate, deactivate } = useCursorProvider()

  const activateLabel = useCallback(() => {
    if (!showLabel) return
    activate(id, { icon, label, labelClassName })
  }, [activate, icon, id, label, labelClassName, showLabel])

  useEffect(() => {
    if (isHoveringRef.current) activateLabel()
  }, [activateLabel])

  useEffect(() => {
    return () => deactivate(id)
  }, [deactivate, id])

  const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    isHoveringRef.current = true
    activateLabel()
  }

  const handlePointerLeave = () => {
    isHoveringRef.current = false
    deactivate(id)
  }

  return (
    <Component
      className={cn("cursor-follow-target", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Component>
  )
}
