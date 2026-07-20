"use client"

import { animate, createAnimatable, remove, spring } from "animejs"
import {
  useEffect,
  useId,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useSound } from "@/hooks/use-sound"
import { metalClickSound } from "@/lib/metal-click"

type Point = readonly [x: number, y: number]

const EXTRUSION_DEPTH = 32
const PRESSED_OFFSET = 16

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
  const faceFillRef = useRef<SVGPathElement>(null)
  const strokeRef = useRef<SVGPathElement>(null)
  const radialGradientRef = useRef<SVGRadialGradientElement>(null)
  const sidePathRefs = useRef<Array<SVGPathElement | null>>([])
  const [play] = useSound(metalClickSound, { interrupt: true })

  useEffect(() => {
    const svg = ref.current
    const faceFill = faceFillRef.current
    const stroke = strokeRef.current
    const radialGradient = radialGradientRef.current
    const sidePaths = [...sidePathRefs.current]
    if (!svg || !radialGradient) return

    const hoverQuery = window.matchMedia("(hover: hover)")
    const gradientAnimator = createAnimatable(radialGradient, {
      cx: {
        duration: 600,
        ease: spring({ stiffness: 300, damping: 30, mass: 0.1 }),
      },
      cy: {
        duration: 600,
        ease: spring({ stiffness: 300, damping: 30, mass: 0.1 }),
      },
    })
    let isListening = false
    let isIntersecting = false

    const handleMouseMove = (event: MouseEvent) => {
      gradientAnimator.cx((event.clientX / window.innerWidth) * 556)
      gradientAnimator.cy((event.clientY / window.innerHeight) * 354)
    }

    const setMouseTracking = (enabled: boolean) => {
      const shouldListen = enabled && hoverQuery.matches
      if (shouldListen === isListening) return

      isListening = shouldListen
      if (shouldListen) {
        window.addEventListener("mousemove", handleMouseMove)
      } else {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        setMouseTracking(isIntersecting)
      },
      { rootMargin: "80px" }
    )

    const handleHoverChange = () => setMouseTracking(isIntersecting)

    observer.observe(svg)
    hoverQuery.addEventListener("change", handleHoverChange)

    return () => {
      setMouseTracking(false)
      observer.disconnect()
      hoverQuery.removeEventListener("change", handleHoverChange)
      gradientAnimator.revert()
      remove(
        [faceFill, stroke, ...sidePaths].filter(
          (path): path is SVGPathElement => path !== null
        )
      )
    }
  }, [])

  const animatePressedState = (pressed: boolean) => {
    const topOffset = pressed ? PRESSED_OFFSET : 0
    const pressEase = () => spring({ mass: 0.5, damping: 18, stiffness: 200 })
    const faceFill = faceFillRef.current
    const stroke = strokeRef.current

    if (faceFill) {
      remove(faceFill)
      animate(faceFill, {
        d: closedPath(K_POINTS, topOffset),
        ease: pressEase(),
      })
    }

    if (stroke) {
      remove(stroke)
      animate(stroke, {
        d: outlinePath(topOffset),
        ease: pressEase(),
      })
    }

    sidePathRefs.current.forEach((path, index) => {
      if (!path) return
      const point = K_POINTS[index]
      const nextPoint = K_POINTS[(index + 1) % K_POINTS.length]

      remove(path)
      animate(path, {
        d: sidePath(point, nextPoint, topOffset),
        ease: pressEase(),
      })
    })
  }

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    void play()
    animatePressedState(true)
  }

  const handlePointerRelease = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    animatePressedState(false)
  }

  return (
    <svg
      ref={ref}
      className="h-auto w-full touch-manipulation"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerRelease}
      onPointerCancel={handlePointerRelease}
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

        <path ref={faceFillRef} id={ids.faceFill} d={K_TOP_PATH} />
        <path ref={strokeRef} id={ids.stroke} d={outlinePath(0)} />

        <radialGradient
          ref={radialGradientRef}
          id={ids.radialGradient}
          cx="278"
          cy="177"
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f1f1ed" />
          <stop offset="1" stopColor="#f1f1ed" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        {K_POINTS.map((point, index) => {
          const nextPoint = K_POINTS[(index + 1) % K_POINTS.length]
          return (
            <path
              ref={(path) => {
                sidePathRefs.current[index] = path
              }}
              key={`${point[0]}-${point[1]}`}
              d={sidePath(point, nextPoint, 0)}
            />
          )
        })}
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />
      <use href={`#${ids.stroke}`} stroke="rgb(241 241 237 / 0.24)" />
      <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
    </svg>
  )
}
