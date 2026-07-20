import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import Script from "next/script"
import { ReactLenis } from "lenis/react"
import { cn } from "@/lib/utils"

const khTeka = localFont({
  src: [
    {
      path: "../fonts/khteka/KHTeka-Regular.woff2",
      weight: "400",
    },
    {
      path: "../fonts/khteka/KHTeka-Medium.woff2",
      weight: "500",
    },
  ],
  variable: "--font-kh-teka",
})

const messinaSansMono = localFont({
  src: "../fonts/Messina/MessinaSansMonoWeb-VF_TESTFONT.woff2",
  variable: "--font-messina-sans-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Karnik Kanojia",
  description: "Karnik Kanojia | SRE @ Oracle | Ex-Data Scientist @ MI4People",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", khTeka.variable, messinaSansMono.variable)}
    >
      <body>
        <Script id="initial-scroll-position" strategy="beforeInteractive">
          {`if (!window.location.hash) { window.history.scrollRestoration = "manual"; window.scrollTo(0, 0); }`}
        </Script>
        <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: 0.1 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  )
}
