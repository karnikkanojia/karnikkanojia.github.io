"use client"

import { createTimeline } from "animejs"
import { useCallback, useEffect, useRef, useState } from "react"

export function IntroLoader() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const tealPanelRef = useRef<HTMLDivElement>(null)
  const grayPanelRef = useRef<HTMLDivElement>(null)
  const whitePanelRef = useRef<HTMLDivElement>(null)
  const playbackStartedRef = useRef(false)
  const [exited, setExited] = useState(false)

  const playVideo = useCallback(() => {
    const video = videoRef.current
    const tealPanel = tealPanelRef.current
    const grayPanel = grayPanelRef.current
    const whitePanel = whitePanelRef.current
    if (
      !video ||
      !tealPanel ||
      !grayPanel ||
      !whitePanel ||
      playbackStartedRef.current ||
      !Number.isFinite(video.duration)
    )
      return
    playbackStartedRef.current = true
    video.pause()
    video.currentTime = 0

    const playhead = { time: 0 }
    const videoDuration = video.duration * 1000
    const panelEntryDuration = 650
    const panelExitDuration = 700
    const panelStagger = 120
    // `outExpo` reaches its final visual frames around the middle of its
    // timeline. Start the panel handoff there instead of waiting through the
    // easing curve's long, nearly-static tail.
    const panelEntryStart = videoDuration * 0.85
    const panelExitStart =
      panelEntryStart + panelEntryDuration + panelStagger * 2 + 140

    createTimeline({
      onUpdate: () => {
        video.currentTime = playhead.time
      },
      onComplete: () => {
        video.currentTime = video.duration
        setExited(true)
      },
    })
      .add(playhead, {
        time: video.duration,
        duration: videoDuration,
        ease: "outExpo",
      })
      .add(
        tealPanel,
        {
          y: ["100%", "0%"],
          duration: panelEntryDuration,
          ease: "outExpo",
        },
        panelEntryStart
      )
      .add(
        grayPanel,
        {
          y: ["100%", "0%"],
          duration: panelEntryDuration,
          ease: "outExpo",
        },
        panelEntryStart + panelStagger
      )
      .add(
        whitePanel,
        {
          y: ["100%", "0%"],
          duration: panelEntryDuration,
          ease: "outExpo",
        },
        panelEntryStart + panelStagger * 2
      )
      .add(
        tealPanel,
        {
          y: "-100%",
          duration: panelExitDuration,
          ease: "outExpo",
        },
        panelExitStart
      )
      .add(
        grayPanel,
        {
          y: "-100%",
          duration: panelExitDuration,
          ease: "outExpo",
        },
        panelExitStart + panelStagger
      )
      .add(
        whitePanel,
        {
          y: "-100%",
          duration: panelExitDuration,
          ease: "outExpo",
        },
        panelExitStart + panelStagger * 2
      )
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) playVideo()
    else video.addEventListener("loadedmetadata", playVideo, { once: true })

    return () => video.removeEventListener("loadedmetadata", playVideo)
  }, [playVideo])

  if (exited) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-white"
      aria-label="Loading"
      role="status"
    >
      <div className="relative z-[1] w-[98vw] md:w-[70vw]">
        <video
          ref={videoRef}
          className="block h-auto w-full"
          muted
          playsInline
          preload="auto"
          poster="/videos/intro-poster.webp"
          onError={() => setExited(true)}
        >
          <source
            media="(max-width: 768px)"
            src="/videos/intro-mobile.mp4"
            type="video/mp4"
          />
          <source src="/videos/intro-desktop.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        ref={tealPanelRef}
        className="absolute inset-0 z-[2] translate-y-full bg-[#53C1E9] [will-change:transform]"
        aria-hidden="true"
      />
      <div
        ref={grayPanelRef}
        className="absolute inset-0 z-[3] translate-y-full bg-[#D4D4D4] [will-change:transform]"
        aria-hidden="true"
      />
      <div
        ref={whitePanelRef}
        className="absolute inset-0 z-[4] translate-y-full bg-white [will-change:transform]"
        aria-hidden="true"
      />
    </div>
  )
}
