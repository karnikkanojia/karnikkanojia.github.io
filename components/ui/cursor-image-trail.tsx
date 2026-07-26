"use client"

import * as React from "react"
import { animate, type JSAnimation } from "animejs"

import { cn } from "@/lib/utils"

export interface CursorImageTrailProps {
  items: string[]
  /** Size of each trail image in px. @default 120 */
  itemSize?: number
  /** Number of reusable image slots. @default 8 */
  trailLength?: number
  /** Minimum pointer travel before showing the next image. @default 80 */
  spawnDistance?: number
  /** Maximum random image rotation in degrees. @default 20 */
  rotationRange?: number
  className?: string
  children?: React.ReactNode
}

function preloadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.decoding = "async"
    image.fetchPriority = "low"

    image.onload = async () => {
      try {
        await image.decode()
      } catch {
        // The image is loaded even when a browser declines explicit decoding.
      }
      resolve(image)
    }
    image.onerror = () => resolve(image)
    image.src = src
  })
}

export function CursorImageTrail({
  items,
  itemSize = 120,
  trailLength = 8,
  spawnDistance = 80,
  rotationRange = 20,
  className,
  children,
}: CursorImageTrailProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const slotRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const imageRefs = React.useRef<Array<HTMLImageElement | null>>([])
  const animationsRef = React.useRef<Array<JSAnimation | null>>([])
  const preloadedImagesRef = React.useRef<HTMLImageElement[]>([])
  const activeSlotsRef = React.useRef<boolean[]>([])
  const isReadyRef = React.useRef(false)
  const slotCursorRef = React.useRef(0)
  const imageCursorRef = React.useRef(0)
  const zIndexRef = React.useRef(0)

  React.useEffect(() => {
    let isCancelled = false
    isReadyRef.current = false

    Promise.all(items.map(preloadImage)).then((images) => {
      if (isCancelled) return
      preloadedImagesRef.current = images
      isReadyRef.current = images.some((image) => image.naturalWidth > 0)
    })

    return () => {
      isCancelled = true
      isReadyRef.current = false
      preloadedImagesRef.current = []
    }
  }, [items])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || items.length === 0 || trailLength === 0) return
    const animations = animationsRef.current

    let containerRect = container.getBoundingClientRect()
    let lastPosition: { x: number; y: number } | null = null
    let pendingPosition: { x: number; y: number } | null = null
    let pointerFrame: number | undefined
    let boundsFrame: number | undefined
    let inactivityTimer: number | undefined

    const refreshBounds = () => {
      containerRect = container.getBoundingClientRect()
    }

    const requestBoundsRefresh = () => {
      if (boundsFrame !== undefined) return
      boundsFrame = requestAnimationFrame(() => {
        boundsFrame = undefined
        refreshBounds()
      })
    }

    const stopSlotAnimation = (slotIndex: number) => {
      animations[slotIndex]?.pause()
      animations[slotIndex] = null
    }

    const showNextImage = (x: number, y: number) => {
      const slotIndex = slotCursorRef.current % trailLength
      const imageIndex = imageCursorRef.current % items.length
      const slot = slotRefs.current[slotIndex]
      const image = imageRefs.current[slotIndex]
      if (!slot || !image) return

      stopSlotAnimation(slotIndex)

      const rotation = (Math.random() * 2 - 1) * rotationRange
      image.src = items[imageIndex]
      slot.style.left = `${x}px`
      slot.style.top = `${y}px`
      slot.style.zIndex = `${100 + ++zIndexRef.current}`
      slot.style.opacity = "0"
      slot.style.transform = `translate3d(-50%, -50%, 0) scale(0.68) rotate(${rotation * 1.25}deg)`
      activeSlotsRef.current[slotIndex] = true

      animations[slotIndex] = animate(slot, {
        opacity: [0, 1],
        scale: [0.68, 1],
        rotate: [rotation * 1.25, rotation],
        duration: 260,
        ease: "out(3)",
      })

      slotCursorRef.current += 1
      imageCursorRef.current += 1
    }

    const processPointerPosition = () => {
      pointerFrame = undefined
      if (!pendingPosition || !isReadyRef.current) return

      const x = pendingPosition.x - containerRect.left
      const y = pendingPosition.y - containerRect.top
      pendingPosition = null

      if (lastPosition) {
        const distance = Math.hypot(
          x - lastPosition.x,
          y - lastPosition.y
        )
        if (distance < spawnDistance) return
      }

      lastPosition = { x, y }
      showNextImage(x, y)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      pendingPosition = { x: event.clientX, y: event.clientY }
      if (inactivityTimer !== undefined) {
        window.clearTimeout(inactivityTimer)
      }
      inactivityTimer = window.setTimeout(hideTrail, 700)
      if (pointerFrame === undefined) {
        pointerFrame = requestAnimationFrame(processPointerPosition)
      }
    }

    const hideTrail = () => {
      lastPosition = null
      pendingPosition = null
      if (inactivityTimer !== undefined) {
        window.clearTimeout(inactivityTimer)
        inactivityTimer = undefined
      }
      if (pointerFrame !== undefined) {
        cancelAnimationFrame(pointerFrame)
        pointerFrame = undefined
      }

      activeSlotsRef.current.forEach((isActive, slotIndex) => {
        const slot = slotRefs.current[slotIndex]
        if (!isActive || !slot) return

        stopSlotAnimation(slotIndex)
        animations[slotIndex] = animate(slot, {
          opacity: 0,
          scale: 0.86,
          duration: 180,
          ease: "out(2)",
          onComplete: () => {
            activeSlotsRef.current[slotIndex] = false
          },
        })
      })
    }

    const onPointerEnter = () => refreshBounds()

    container.addEventListener("pointerenter", onPointerEnter)
    container.addEventListener("pointermove", onPointerMove, { passive: true })
    container.addEventListener("pointerleave", hideTrail)
    window.addEventListener("resize", requestBoundsRefresh)
    window.addEventListener("scroll", requestBoundsRefresh, { passive: true })

    return () => {
      container.removeEventListener("pointerenter", onPointerEnter)
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerleave", hideTrail)
      window.removeEventListener("resize", requestBoundsRefresh)
      window.removeEventListener("scroll", requestBoundsRefresh)
      if (pointerFrame !== undefined) cancelAnimationFrame(pointerFrame)
      if (boundsFrame !== undefined) cancelAnimationFrame(boundsFrame)
      if (inactivityTimer !== undefined) {
        window.clearTimeout(inactivityTimer)
      }
      animations.forEach((animation) => animation?.pause())
    }
  }, [items, rotationRange, spawnDistance, trailLength])

  return (
    <div
      ref={containerRef}
      className={cn("relative z-20 overflow-visible", className)}
    >
      {children}

      {Array.from({ length: trailLength }, (_, slotIndex) => (
        <div
          key={slotIndex}
          ref={(element) => {
            slotRefs.current[slotIndex] = element
          }}
          aria-hidden="true"
          className="pointer-events-none absolute z-50 select-none"
          style={{
            left: 0,
            top: 0,
            width: itemSize,
            opacity: 0,
            contain: "layout paint style",
            transform: "translate3d(-50%, -50%, 0) scale(0.68)",
            transformOrigin: "center",
            willChange: "transform, opacity",
          }}
        >
          {/* A plain img lets the fixed pool swap predecoded local assets without React renders. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(element) => {
              imageRefs.current[slotIndex] = element
            }}
            alt=""
            draggable={false}
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      ))}
    </div>
  )
}
