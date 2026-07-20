"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getAudioContext, decodeAudioData } from "@/lib/sound-engine"
import type {
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/sound-types"

export function useSound(
  sound: SoundAsset,
  options: UseSoundOptions = {}
): UseSoundReturn {
  const {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    onPlay,
    onEnd,
    onPause,
    onStop,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(
    sound.duration ?? null
  )
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const bufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null)

  useEffect(() => {
    let cancelled = false
    const bufferPromise = decodeAudioData(sound.dataUri)
    bufferPromiseRef.current = bufferPromise

    bufferPromise
      .then((buffer) => {
        if (!cancelled) {
          bufferRef.current = buffer
          setDuration(buffer.duration)
        }
      })
      .catch(() => {
        if (!cancelled) bufferPromiseRef.current = null
      })
    return () => {
      cancelled = true
    }
  }, [sound.dataUri])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch {
        // Already stopped
      }
      sourceRef.current = null
    }
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause()
      fallbackAudioRef.current.currentTime = 0
      fallbackAudioRef.current = null
    }
    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const play = useCallback(
    async (overrides?: { volume?: number; playbackRate?: number }) => {
      if (!soundEnabled) return

      const resolvedVolume = overrides?.volume ?? volume
      const resolvedPlaybackRate = overrides?.playbackRate ?? playbackRate

      try {
        const ctx = getAudioContext()

        if (ctx.state === "suspended") {
          await ctx.resume()
        }

        const buffer =
          bufferRef.current ??
          (await (bufferPromiseRef.current ?? decodeAudioData(sound.dataUri)))

        bufferRef.current = buffer

        if (interrupt && sourceRef.current) {
          stop()
        }

        const source = ctx.createBufferSource()
        const gain = ctx.createGain()

        source.buffer = buffer
        source.playbackRate.value = resolvedPlaybackRate
        gain.gain.value = resolvedVolume

        source.connect(gain)
        gain.connect(ctx.destination)

        source.onended = () => {
          setIsPlaying(false)
          onEnd?.()
        }

        source.start(0)
        sourceRef.current = source
        gainRef.current = gain
        setIsPlaying(true)
        onPlay?.()
      } catch {
        if (typeof Audio === "undefined") return

        if (interrupt && fallbackAudioRef.current) {
          fallbackAudioRef.current.pause()
        }

        const audio = new Audio(sound.dataUri)
        audio.volume = resolvedVolume
        audio.playbackRate = resolvedPlaybackRate
        audio.onended = () => {
          fallbackAudioRef.current = null
          setIsPlaying(false)
          onEnd?.()
        }

        fallbackAudioRef.current = audio
        await audio.play()
        setIsPlaying(true)
        onPlay?.()
      }
    },
    [
      sound.dataUri,
      soundEnabled,
      playbackRate,
      volume,
      interrupt,
      stop,
      onPlay,
      onEnd,
    ]
  )

  const pause = useCallback(() => {
    stop()
    onPause?.()
  }, [stop, onPause])

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop()
        } catch {
          // Already stopped
        }
      }
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.pause()
      }
    }
  }, [])

  return [play, { stop, pause, isPlaying, duration, sound }] as const
}
