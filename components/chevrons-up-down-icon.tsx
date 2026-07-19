"use client"

import { animate, cubicBezier, remove } from "animejs"
import { useImperativeHandle, useRef } from "react"

export type ChevronsUpDownIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ChevronsUpDownIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<ChevronsUpDownIconHandle>
  duration?: number
}

export function ChevronsUpDownIcon({
  ref,
  duration = 0.3,
  ...props
}: ChevronsUpDownIconProps) {
  const lowerPathRef = useRef<SVGPathElement>(null)
  const upperPathRef = useRef<SVGPathElement>(null)

  const morph = (lower: string, upper: string) => {
    const paths = [lowerPathRef.current, upperPathRef.current]
    paths.forEach((path) => path && remove(path))

    if (lowerPathRef.current) {
      animate(lowerPathRef.current, {
        d: lower,
        duration: duration * 1000,
        ease: cubicBezier(0.77, 0, 0.175, 1),
      })
    }
    if (upperPathRef.current) {
      animate(upperPathRef.current, {
        d: upper,
        duration: duration * 1000,
        ease: cubicBezier(0.77, 0, 0.175, 1),
      })
    }
  }

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => morph("M7 20L12 15L17 20", "M7 4L12 9L17 4"),
      stopAnimation: () => morph("M7 15L12 20L17 15", "M7 9L12 4L17 9"),
    }
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path ref={lowerPathRef} d="M7 15L12 20L17 15" />
      <path ref={upperPathRef} d="M7 9L12 4L17 9" />
    </svg>
  )
}
