import { Haptics, ImpactStyle } from "@capacitor/haptics"

/**
 * Native haptic feedback in Capacitor builds, with its built-in web fallback.
 * Unsupported browsers deliberately receive no feedback.
 */
function impact(style: ImpactStyle) {
  if (typeof window === "undefined") return

  void Haptics.impact({ style }).catch(() => {
    // Haptics are an enhancement; unavailable hardware must not affect the UI.
  })
}

export const haptics = {
  light: () => impact(ImpactStyle.Light),
  medium: () => impact(ImpactStyle.Medium),
}
