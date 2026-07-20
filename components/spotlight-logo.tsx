"use client"

import { useEffect, useId, useRef } from "react"
import { useSound } from "@/hooks/use-sound"
import { metalClickSound } from "@/lib/metal-click"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

type Point = readonly [x: number, y: number]

const EXTRUSION_DEPTH = 32
const PRESSED_OFFSET = 16

const pressTransition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

// A forward-reading K drawn directly in upright SVG coordinates.
const K_POINTS: readonly Point[] = [
  [92, 20],
  [172, 20],
  [172, 132],
  [300, 20],
  [416, 20],
  [246, 169],
  [430, 310],
  [310, 310],
  [172, 202],
  [172, 310],
  [92, 310],
]

function closedPath(points: readonly Point[], offsetY = 0) {
  return `${points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y + offsetY}`)
    .join(" ")} Z`
}

function sidePath(start: Point, end: Point, topOffset: number) {
  return [
    `M${start[0]} ${start[1] + topOffset}`,
    `L${end[0]} ${end[1] + topOffset}`,
    `L${end[0]} ${end[1] + EXTRUSION_DEPTH}`,
    `L${start[0]} ${start[1] + EXTRUSION_DEPTH}`,
    "Z",
  ].join(" ")
}

function outlinePath(topOffset: number) {
  const connectors = K_POINTS.map(
    ([x, y]) => `M${x} ${y + topOffset} L${x} ${y + EXTRUSION_DEPTH}`
  ).join(" ")

  return `${closedPath(K_POINTS, topOffset)} ${closedPath(
    K_POINTS,
    EXTRUSION_DEPTH
  )} ${connectors}`
}

const K_TOP_PATH = closedPath(K_POINTS)

export function SpotlightLogo() {
  const id = useId()
  const ids = {
    facePattern: `spotlight-logo-face-pattern-${id}`,
    faceFill: `spotlight-logo-face-fill-${id}`,
    stroke: `spotlight-logo-stroke-${id}`,
    radialGradient: `spotlight-logo-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)
  const [play] = useSound(metalClickSound, { interrupt: true })
  const isInView = useInView(ref, { margin: "80px" })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (!isInView || window.matchMedia("(hover: none)").matches) return

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth)
      mouseY.set(event.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial="normal"
      onPointerDown={() => void play()}
      whileTap="pressed"
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="rgb(241 241 237 / 0.15)"
            strokeWidth="1"
          />
        </pattern>

        <motion.path
          id={ids.faceFill}
          d={K_TOP_PATH}
          variants={{
            normal: { transform: "translateY(0px)" },
            pressed: { transform: `translateY(${PRESSED_OFFSET}px)` },
          }}
          transition={pressTransition}
        />
        <motion.path
          id={ids.stroke}
          variants={{
            normal: { d: outlinePath(0) },
            pressed: { d: outlinePath(PRESSED_OFFSET) },
          }}
          transition={pressTransition}
        />

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1f1ed" />
          <stop offset="1" stopColor="#f1f1ed" stopOpacity="0" />
        </motion.radialGradient>
      </defs>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        {K_POINTS.map((point, index) => {
          const nextPoint = K_POINTS[(index + 1) % K_POINTS.length]
          return (
            <motion.path
              key={`${point[0]}-${point[1]}`}
              variants={{
                normal: { d: sidePath(point, nextPoint, 0) },
                pressed: {
                  d: sidePath(point, nextPoint, PRESSED_OFFSET),
                },
              }}
              transition={pressTransition}
            />
          )
        })}
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />
      <use href={`#${ids.stroke}`} stroke="rgb(241 241 237 / 0.24)" />
      <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
    </motion.svg>
  )
}
