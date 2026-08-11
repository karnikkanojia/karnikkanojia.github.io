"use client"

import { useEffect, useState } from "react"

import {
  getSiteFooterActiveState,
  isSiteFooterActive,
  SITE_FOOTER_ACTIVE_EVENT,
} from "@/lib/site-footer-state"

type NavbarScrollState = {
  isFooterActive: boolean
  isVisible: boolean
  isScrolled: boolean
}

const MOBILE_VIEWPORT_QUERY = "(max-width: 767px)"
const SCROLL_DIRECTION_THRESHOLD = 8
const DIRECTIONAL_INPUT_WINDOW_MS = 1_200

export function useNavbarScrollState(): NavbarScrollState {
  const [state, setState] = useState<NavbarScrollState>({
    isFooterActive: false,
    isVisible: true,
    isScrolled: false,
  })

  useEffect(() => {
    let previousScrollY = window.scrollY
    let directionStartY = previousScrollY
    let previousDirection = 0
    let footerActive = isSiteFooterActive()
    let heroEndY = 0
    let frameId: number | undefined
    let touchStart: { x: number; y: number } | undefined
    let touchMoved = false
    let directionalInputUntil = 0
    const mobileViewport = window.matchMedia(MOBILE_VIEWPORT_QUERY)

    const resetScrollDirection = () => {
      previousScrollY = window.scrollY
      directionStartY = previousScrollY
      previousDirection = 0
    }

    const measurePageAnchors = () => {
      const hero = document.querySelector<HTMLElement>(
        "[data-hero-scroll-section]"
      )
      heroEndY = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY
        : window.innerHeight + 80
    }

    const updateState = () => {
      frameId = undefined
      const currentScrollY = window.scrollY
      const canTrackDirection =
        !mobileViewport.matches || performance.now() < directionalInputUntil
      const direction = canTrackDirection
        ? Math.sign(currentScrollY - previousScrollY)
        : 0

      if (!canTrackDirection) {
        previousScrollY = currentScrollY
        directionStartY = currentScrollY
        previousDirection = 0
      }

      if (direction !== 0 && direction !== previousDirection) {
        directionStartY = previousScrollY
        previousDirection = direction
      }

      const directionalDistance = currentScrollY - directionStartY
      previousScrollY = currentScrollY
      const isHeroActive = currentScrollY + window.innerHeight <= heroEndY + 1
      const isFooterActive = footerActive

      setState((current) => {
        const isVisible = isFooterActive
          ? false
          : isHeroActive
            ? true
            : directionalDistance < -SCROLL_DIRECTION_THRESHOLD
              ? true
              : directionalDistance > SCROLL_DIRECTION_THRESHOLD
                ? false
                : current.isVisible
        const isScrolled = currentScrollY > 24

        return current.isVisible === isVisible &&
          current.isFooterActive === isFooterActive &&
          current.isScrolled === isScrolled
          ? current
          : { isFooterActive, isVisible, isScrolled }
      })
    }

    const requestUpdate = () => {
      if (frameId === undefined) frameId = requestAnimationFrame(updateState)
    }

    const handleResize = () => {
      resetScrollDirection()
      measurePageAnchors()
      requestUpdate()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return
      touchStart = { x: event.clientX, y: event.clientY }
      touchMoved = false
      directionalInputUntil = 0
      resetScrollDirection()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !touchStart) return

      if (!touchMoved) {
        const distance = Math.hypot(
          event.clientX - touchStart.x,
          event.clientY - touchStart.y
        )
        if (distance < 10) return
        touchMoved = true
      }

      directionalInputUntil = performance.now() + DIRECTIONAL_INPUT_WINDOW_MS
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || !touchStart) return
      touchStart = undefined

      if (touchMoved) {
        directionalInputUntil = performance.now() + DIRECTIONAL_INPUT_WINDOW_MS
      } else {
        directionalInputUntil = 0
        resetScrollDirection()
      }
      touchMoved = false
    }

    const handlePointerCancel = () => {
      touchStart = undefined
      touchMoved = false
      directionalInputUntil = 0
      resetScrollDirection()
    }

    const handleWheel = () => {
      directionalInputUntil = performance.now() + DIRECTIONAL_INPUT_WINDOW_MS
    }

    const handleFooterActiveChange = (event: Event) => {
      footerActive = getSiteFooterActiveState(event)
      requestUpdate()
    }

    measurePageAnchors()
    updateState()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", handleResize)
    window.visualViewport?.addEventListener("resize", handleResize)
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    window.addEventListener("pointercancel", handlePointerCancel, {
      passive: true,
    })
    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener(SITE_FOOTER_ACTIVE_EVENT, handleFooterActiveChange)

    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", handleResize)
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerCancel)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener(
        SITE_FOOTER_ACTIVE_EVENT,
        handleFooterActiveChange
      )
    }
  }, [])

  return state
}
