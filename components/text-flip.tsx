"use client"

import { Children, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { Transition, Variants } from "motion/react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

const defaultVariants: Variants = {
  initial: { y: -8, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 8, opacity: 0 },
}

type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code

export type TextFlipProps = {
  /**
   * Motion element to render.
   * @defaultValue motion.p
   * */
  as?: MotionElement
  className?: string
  /** Array of children to cycle through. */
  children: React.ReactNode[]

  /**
   * Time in seconds between each flip.
   * @defaultValue 2
   * */
  interval?: number
  /**
   * Motion transition configuration.
   * @defaultValue { duration: 0.3 }
   * */
  transition?: Transition
  /** Motion variants for enter/exit animations. */
  variants?: Variants

  /** Controls whether the flip animation runs. */
  play?: boolean
  /** Controls whether the animation should loop after the last item. */
  loop?: boolean

  /** Called with the new index after each flip. */
  onIndexChange?: (index: number) => void
}

export function TextFlip({
  as: Component = motion.p,
  className,
  children,

  interval = 2,
  transition = { duration: 0.3 },
  variants = defaultVariants,
  play = true,
  loop = true,

  onIndexChange,
}: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState("auto")
  const measureRef = useRef<HTMLSpanElement>(null)

  const items = Children.toArray(children)

  useLayoutEffect(() => {
    const element = measureRef.current?.children[currentIndex]

    if (element) {
      setWidth(`${element.getBoundingClientRect().width}px`)
    }
  }, [currentIndex, items.length])

  useEffect(() => {
    if (!play) return
    if (!loop && currentIndex >= items.length - 1) return

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1

        if (next >= items.length) {
          return loop ? 0 : prev
        }

        onIndexChange?.(next)
        return next
      })
    }, interval * 1000)

    return () => clearTimeout(timer)
  }, [currentIndex, interval, items.length, loop, onIndexChange, play])

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

      <motion.span
        className="relative inline-block whitespace-nowrap align-baseline"
        animate={{
          width,
          transition: {
            type: "spring",
            duration: 0.35,
            bounce: 0,
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <Component
            key={currentIndex}
            className={cn("inline-block", className)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            variants={variants}
          >
            {items[currentIndex]}
          </Component>
        </AnimatePresence>
      </motion.span>
    </>
  )
}
