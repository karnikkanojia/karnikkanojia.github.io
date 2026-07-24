"use client"

import { useLenis } from "lenis/react"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const NAVBAR_REVEAL_PROGRESS = 0.85
const PLAYBACK_TIMEOUT_BUFFER_MS = 1_500
const EXIT_DURATION_MS = 900
const EXIT_TIMEOUT_BUFFER_MS = 100

type IntroTransitionProps = {
  children: ReactNode
}

export function IntroTransition({ children }: IntroTransitionProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const skipIntroRef = useRef(false)
  const playbackStartedRef = useRef(false)
  const finishingRef = useRef(false)
  const removedRef = useRef(false)
  const navbarRevealedRef = useRef(false)
  const navbarRevealTimeoutRef = useRef<number | undefined>(undefined)
  const playbackTimeoutRef = useRef<number | undefined>(undefined)
  const exitTimeoutRef = useRef<number | undefined>(undefined)
  const [introVisible, setIntroVisible] = useState(true)
  const [introFinishing, setIntroFinishing] = useState(false)
  const lenis = useLenis()

  const revealNavbar = useCallback(() => {
    if (navbarRevealedRef.current) return
    navbarRevealedRef.current = true
    document.documentElement.dataset.siteNavbarReady = "true"
    window.dispatchEvent(new Event("site-loader:navbar-reveal"))
  }, [])

  const removeIntro = useCallback(() => {
    if (removedRef.current) return
    removedRef.current = true
    if (exitTimeoutRef.current !== undefined) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = undefined
    }

    setIntroVisible(false)
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("site-loader:hero-enter"))
    })
  }, [])

  const finishIntro = useCallback(() => {
    if (finishingRef.current) return
    finishingRef.current = true
    if (navbarRevealTimeoutRef.current !== undefined) {
      window.clearTimeout(navbarRevealTimeoutRef.current)
      navbarRevealTimeoutRef.current = undefined
    }
    if (playbackTimeoutRef.current !== undefined) {
      window.clearTimeout(playbackTimeoutRef.current)
      playbackTimeoutRef.current = undefined
    }

    document.documentElement.dataset.siteIntroComplete = "true"
    revealNavbar()
    window.dispatchEvent(new Event("site-loader:complete"))

    const loader = loaderRef.current
    if (!loader) {
      removeIntro()
      return
    }

    setIntroFinishing(true)
    exitTimeoutRef.current = window.setTimeout(
      removeIntro,
      EXIT_DURATION_MS + EXIT_TIMEOUT_BUFFER_MS
    )
  }, [removeIntro, revealNavbar])

  const playIntro = useCallback(async () => {
    const video = videoRef.current
    if (
      !video ||
      playbackStartedRef.current ||
      !Number.isFinite(video.duration)
    )
      return

    playbackStartedRef.current = true
    video.currentTime = 0

    try {
      await video.play()
      navbarRevealTimeoutRef.current = window.setTimeout(
        revealNavbar,
        video.duration * NAVBAR_REVEAL_PROGRESS * 1_000
      )
      playbackTimeoutRef.current = window.setTimeout(
        finishIntro,
        video.duration * 1_000 + PLAYBACK_TIMEOUT_BUFFER_MS
      )
    } catch {
      finishIntro()
    }
  }, [finishIntro, revealNavbar])

  useLayoutEffect(() => {
    if (document.documentElement.dataset.siteSkipIntro !== "true") return

    skipIntroRef.current = true
    finishingRef.current = true
    removedRef.current = true
    navbarRevealedRef.current = true
    requestAnimationFrame(() => {
      setIntroVisible(false)
      window.dispatchEvent(new Event("site-loader:complete"))
      window.dispatchEvent(new Event("site-loader:hero-enter"))
    })
  }, [])

  useEffect(() => {
    if (!introVisible) return

    lenis?.stop()
    return () => lenis?.start()
  }, [introVisible, lenis])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    content.inert = introVisible
    return () => {
      content.inert = false
    }
  }, [introVisible])

  useEffect(() => {
    if (skipIntroRef.current) return
    const video = videoRef.current
    if (!video) return

    const onLoadedMetadata = () => void playIntro()
    const onEnded = () => finishIntro()

    video.addEventListener("ended", onEnded, { once: true })
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) void playIntro()
    else
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true })

    return () => {
      video.pause()
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("ended", onEnded)
      if (navbarRevealTimeoutRef.current !== undefined) {
        window.clearTimeout(navbarRevealTimeoutRef.current)
      }
      if (playbackTimeoutRef.current !== undefined) {
        window.clearTimeout(playbackTimeoutRef.current)
      }
    }
  }, [finishIntro, introVisible, playIntro, revealNavbar])

  useEffect(
    () => () => {
      if (exitTimeoutRef.current !== undefined) {
        window.clearTimeout(exitTimeoutRef.current)
      }
    },
    []
  )

  return (
    <>
      <div
        ref={contentRef}
        className="relative z-10 flow-root min-h-screen w-full bg-white"
      >
        {children}
      </div>
      {introVisible && (
        <div
          ref={loaderRef}
          data-site-intro
          className={`fixed inset-0 z-100 grid place-items-center overflow-hidden bg-white transition-opacity duration-900 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            introFinishing ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
          onTransitionEnd={(event) => {
            if (
              introFinishing &&
              event.target === event.currentTarget &&
              event.propertyName === "opacity"
            ) {
              removeIntro()
            }
          }}
        >
          <div
            className={`w-[98vw] transform-gpu transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-[70vw] ${
              introFinishing ? "scale-[0.96]" : "scale-100"
            }`}
          >
            <video
              ref={videoRef}
              className="block h-auto w-full translate-x-[2vw] md:translate-x-0"
              width={1440}
              height={810}
              muted
              playsInline
              aria-hidden="true"
              preload="auto"
              poster="/videos/intro-poster.webp"
              onError={finishIntro}
            >
              <source
                media="(max-width: 768px)"
                src="/videos/intro-mobile.mp4"
                type="video/mp4"
              />
              <source src="/videos/intro-desktop.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  )
}
