"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const selectSoundUrl = new URL("../assets/select.wav", import.meta.url).href;

type SoundEffectsContextValue = {
  isMuted: boolean;
  toggleMuted: () => void;
};

const SoundEffectsContext =
  createContext<SoundEffectsContextValue | null>(null);

function getInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const el = target.closest(
    'a, button, [role="button"], [role="link"], input, select, textarea'
  );

  if (el instanceof Element && el.hasAttribute("data-no-sound")) return null;

  return el;
}

export function SoundEffectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    selectAudioRef.current = new Audio(selectSoundUrl);

    selectAudioRef.current.preload = "auto";
    selectAudioRef.current.volume = 0.45;

    return () => {
      selectAudioRef.current = null;
    };
  }, []);

  const play = useCallback(
    (audio: HTMLAudioElement | null, options?: { ignoreMuted?: boolean }) => {
      if (!audio || (!options?.ignoreMuted && isMutedRef.current)) return;

      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Browsers can block audio before the first user gesture.
      });
    },
    []
  );

  const toggleMuted = useCallback(() => {
    setIsMuted((current) => {
      const next = !current;

      isMutedRef.current = next;

      if (!next) {
        play(selectAudioRef.current, { ignoreMuted: true });
      }

      return next;
    });
  }, [play]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!getInteractiveTarget(event.target)) return;

      play(selectAudioRef.current);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [play]);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMuted,
    }),
    [isMuted, toggleMuted]
  );

  return (
    <SoundEffectsContext.Provider value={value}>
      {children}
    </SoundEffectsContext.Provider>
  );
}

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext);

  if (!context) {
    throw new Error("useSoundEffects must be used within SoundEffectsProvider");
  }

  return context;
}
