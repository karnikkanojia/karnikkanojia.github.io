"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { decodeAudioData, getAudioContext } from "@/lib/sound-engine"
import type {
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/sound-types"

type ActivePlayback = {
  audio?: HTMLAudioElement
  gain?: GainNode
  source?: AudioBufferSourceNode
}

type DecodedDuration = {
  dataUri: string
  value: number
}

type DecodedBuffer = {
  dataUri: string
  value: AudioBuffer
}

type PendingBuffer = {
  dataUri: string
  value: Promise<AudioBuffer>
}

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
  const [decodedDuration, setDecodedDuration] =
    useState<DecodedDuration | null>(null)
  const duration =
    decodedDuration?.dataUri === sound.dataUri
      ? decodedDuration.value
      : (sound.duration ?? null)
  const activePlaybacksRef = useRef(new Map<number, ActivePlayback>())
  const bufferRef = useRef<DecodedBuffer | null>(null)
  const bufferPromiseRef = useRef<PendingBuffer | null>(null)
  const latestPlayRequestRef = useRef(0)
  const nextPlaybackIdRef = useRef(0)
  const previousSoundDataUriRef = useRef(sound.dataUri)

  useEffect(() => {
    let cancelled = false
    const bufferPromise = decodeAudioData(sound.dataUri)

    bufferRef.current = null
    bufferPromiseRef.current = { dataUri: sound.dataUri, value: bufferPromise }

    bufferPromise
      .then((buffer) => {
        if (cancelled) return
        bufferRef.current = { dataUri: sound.dataUri, value: buffer }
        setDecodedDuration({ dataUri: sound.dataUri, value: buffer.duration })
      })
      .catch(() => {
        if (!cancelled && bufferPromiseRef.current?.value === bufferPromise) {
          bufferPromiseRef.current = null
        }
      })

    return () => {
      cancelled = true
    }
  }, [sound.dataUri])

  const finishPlayback = useCallback(
    (playbackId: number) => {
      if (!activePlaybacksRef.current.delete(playbackId)) return
      setIsPlaying(activePlaybacksRef.current.size > 0)
      onEnd?.()
    },
    [onEnd]
  )

  const clearActivePlaybacks = useCallback((updateReactState = true) => {
    const hadActivePlayback = activePlaybacksRef.current.size > 0

    activePlaybacksRef.current.forEach(({ audio, source }) => {
      if (source) {
        source.onended = null
        try {
          source.stop()
        } catch {
          // The source may already have ended between events.
        }
      }
      if (audio) {
        audio.onended = null
        audio.pause()
        audio.currentTime = 0
      }
    })
    activePlaybacksRef.current.clear()
    if (updateReactState) setIsPlaying(false)

    return hadActivePlayback
  }, [])

  useEffect(() => {
    if (previousSoundDataUriRef.current === sound.dataUri) return

    previousSoundDataUriRef.current = sound.dataUri
    latestPlayRequestRef.current += 1
    clearActivePlaybacks()
  }, [clearActivePlaybacks, sound.dataUri])

  const stop = useCallback(() => {
    latestPlayRequestRef.current += 1
    clearActivePlaybacks()
    onStop?.()
  }, [clearActivePlaybacks, onStop])

  const play = useCallback(
    async (overrides?: { volume?: number; playbackRate?: number }) => {
      if (!soundEnabled) return

      const requestId = ++latestPlayRequestRef.current
      const resolvedVolume = overrides?.volume ?? volume
      const resolvedPlaybackRate = overrides?.playbackRate ?? playbackRate

      if (interrupt && clearActivePlaybacks()) onStop?.()

      try {
        const context = getAudioContext()
        if (context.state === "suspended") await context.resume()

        const decodedBuffer = bufferRef.current
        const pendingBuffer = bufferPromiseRef.current
        const buffer =
          decodedBuffer?.dataUri === sound.dataUri
            ? decodedBuffer.value
            : await (pendingBuffer?.dataUri === sound.dataUri
                ? pendingBuffer.value
                : decodeAudioData(sound.dataUri))

        if (interrupt && requestId !== latestPlayRequestRef.current) return
        bufferRef.current = { dataUri: sound.dataUri, value: buffer }

        const playbackId = ++nextPlaybackIdRef.current
        const source = context.createBufferSource()
        const gain = context.createGain()

        source.buffer = buffer
        source.playbackRate.value = resolvedPlaybackRate
        gain.gain.value = resolvedVolume
        source.connect(gain)
        gain.connect(context.destination)
        source.onended = () => finishPlayback(playbackId)

        activePlaybacksRef.current.set(playbackId, { gain, source })
        source.start(0)
        setIsPlaying(true)
        onPlay?.()
      } catch {
        if (typeof Audio === "undefined") return
        if (interrupt && requestId !== latestPlayRequestRef.current) return

        const playbackId = ++nextPlaybackIdRef.current
        const audio = new Audio(sound.dataUri)
        audio.volume = resolvedVolume
        audio.playbackRate = resolvedPlaybackRate
        audio.onended = () => finishPlayback(playbackId)

        activePlaybacksRef.current.set(playbackId, { audio })
        try {
          await audio.play()
          if (!activePlaybacksRef.current.has(playbackId)) return
          setIsPlaying(true)
          onPlay?.()
        } catch {
          activePlaybacksRef.current.delete(playbackId)
          setIsPlaying(activePlaybacksRef.current.size > 0)
        }
      }
    },
    [
      clearActivePlaybacks,
      finishPlayback,
      interrupt,
      onPlay,
      onStop,
      playbackRate,
      sound.dataUri,
      soundEnabled,
      volume,
    ]
  )

  const pause = useCallback(() => {
    stop()
    onPause?.()
  }, [onPause, stop])

  useEffect(() => {
    activePlaybacksRef.current.forEach(({ audio, gain }) => {
      if (gain) gain.gain.value = volume
      if (audio) audio.volume = volume
    })
  }, [volume])

  useEffect(
    () => () => {
      latestPlayRequestRef.current += 1
      clearActivePlaybacks(false)
    },
    [clearActivePlaybacks]
  )

  return [play, { stop, pause, isPlaying, duration, sound }] as const
}
