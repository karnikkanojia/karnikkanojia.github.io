import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { ReactLenis } from "lenis/react";
import { SoundEffectsProvider } from "@/components/sound-effects-provider";
import "./globals.css";

const khTeka = localFont({
  variable: "--font-kh-teka",
  display: "swap",
  src: [
    {
      path: "../fonts/khkeka/KHTeka-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/khkeka/KHTeka-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

const animo = localFont({
  variable: "--font-animo",
  display: "swap",
  src: [
    {
      path: "../fonts/khkeka/Animo-Normal_Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const suisseIntlMono = localFont({
  variable: "--font-suisse-intl-mono",
  display: "swap",
  src: [
    {
      path: "../fonts/khkeka/SuisseIntlMono-Regular-WebXL.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  display: "swap",
  subsets: ["latin"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Karnik Kanojia | Site Reliability Engineer",
  description: "SRE @ Oracle. Building reliable systems and impactful products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${khTeka.variable} ${animo.variable} ${suisseIntlMono.variable} ${playfairDisplay.variable}`}
    >
      <body className="antialiased selection:bg-accent-dim selection:text-foreground">
        <SoundEffectsProvider>
          <div className="grain-overlay" />
          <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {children}
          </ReactLenis>
        </SoundEffectsProvider>
      </body>
    </html>
  );
}
