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

const tapSoundUrl = new URL("../assets/tap.wav", import.meta.url).href;
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
  const tapAudioRef = useRef<HTMLAudioElement | null>(null);
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastHoverTargetRef = useRef<Element | null>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    tapAudioRef.current = new Audio(tapSoundUrl);
    selectAudioRef.current = new Audio(selectSoundUrl);

    tapAudioRef.current.preload = "auto";
    selectAudioRef.current.preload = "auto";
    tapAudioRef.current.volume = 0.35;
    selectAudioRef.current.volume = 0.45;

    return () => {
      tapAudioRef.current = null;
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
    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const target = getInteractiveTarget(event.target);
      if (!target || target === lastHoverTargetRef.current) return;

      lastHoverTargetRef.current = target;
      play(tapAudioRef.current);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = getInteractiveTarget(event.target);
      if (!target || target !== lastHoverTargetRef.current) return;

      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && target.contains(nextTarget)) return;

      lastHoverTargetRef.current = null;
    };

    const handleClick = (event: MouseEvent) => {
      if (!getInteractiveTarget(event.target)) return;

      play(selectAudioRef.current);
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
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
