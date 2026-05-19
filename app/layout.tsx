import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Karnik Kanojia | Site Reliability Engineer",
  description: "SRE @ Oracle. Building reliable systems and impactful products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased selection:bg-accent-dim selection:text-foreground">
        <div className="grain-overlay" />
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
