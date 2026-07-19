"use client"

import { animate } from "animejs"
import {
  Children,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

export type TextFlipProps = {
  className?: string
  children: ReactNode[]
  interval?: number
  play?: boolean
  loop?: boolean
  onIndexChange?: (index: number) => void
}

export function TextFlip({
  className,
  children,
  interval = 2,
  play = true,
  loop = true,
  onIndexChange,
}: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const incomingRef = useRef<HTMLSpanElement>(null)
  const outgoingRef = useRef<HTMLSpanElement>(null)
  const hasMeasuredRef = useRef(false)

  const items = Children.toArray(children)

  useLayoutEffect(() => {
    const item = measureRef.current?.children[currentIndex]
    const wrapper = wrapperRef.current
    if (!item || !wrapper) return

    const width = item.getBoundingClientRect().width

    if (!hasMeasuredRef.current) {
      wrapper.style.width = `${width}px`
      hasMeasuredRef.current = true
      return
    }

    animate(wrapper, {
      width,
      duration: 350,
      ease: "outExpo",
    })
  }, [currentIndex, items.length])

  useLayoutEffect(() => {
    if (outgoingIndex === null || !incomingRef.current) return

    Object.assign(incomingRef.current.style, {
      opacity: "0",
      transform: "translateY(-0.42em)",
      filter: "blur(4px)",
    })
  }, [currentIndex, outgoingIndex])

  useEffect(() => {
    if (outgoingIndex === null) return

    const incoming = incomingRef.current
    const outgoing = outgoingRef.current
    if (!incoming || !outgoing) return

    animate(incoming, {
      opacity: [0, 1],
      translateY: ["-0.42em", "0em"],
      filter: ["blur(4px)", "blur(0px)"],
      duration: 280,
      ease: "outExpo",
    })

    animate(outgoing, {
      opacity: [1, 0],
      translateY: ["0em", "0.42em"],
      filter: ["blur(0px)", "blur(4px)"],
      duration: 280,
      ease: "outExpo",
      onComplete: () => setOutgoingIndex(null),
    })
  }, [currentIndex, outgoingIndex])

  useEffect(() => {
    if (
      !play ||
      outgoingIndex !== null ||
      (!loop && currentIndex >= items.length - 1)
    ) {
      return
    }

    const timer = window.setTimeout(() => {
      const nextIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1
      setOutgoingIndex(currentIndex)
      setCurrentIndex(nextIndex)
      onIndexChange?.(nextIndex)
    }, interval * 1000)

    return () => window.clearTimeout(timer)
  }, [
    currentIndex,
    interval,
    items.length,
    loop,
    onIndexChange,
    outgoingIndex,
    play,
  ])

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0"
        style={{ visibility: "hidden" }}
      >
        {items.map((item, index) => (
          <span key={index} className={cn("inline-block", className)}>
            {item}
          </span>
        ))}
      </span>
      <span
        ref={wrapperRef}
        className="relative inline-block overflow-visible whitespace-nowrap align-baseline"
      >
        {outgoingIndex !== null && (
          <span
            ref={outgoingRef}
            aria-hidden="true"
            className={cn("absolute top-0 left-0 inline-block", className)}
          >
            {items[outgoingIndex]}
          </span>
        )}
        <span ref={incomingRef} className={cn("inline-block", className)}>
          {items[currentIndex]}
        </span>
      </span>
    </>
  )
}
