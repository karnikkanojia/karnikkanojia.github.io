import type { Metadata } from "next"
import { Agentation } from "agentation"
import "./globals.css"
import localFont from "next/font/local"
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
  title: "Portfolio",
  description: "A new portfolio project.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        khTeka.variable,
        messinaSansMono.variable
      )}
    >
      <body>
        <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: 0.1 }}>
          {children}
          {process.env.NODE_ENV === "development" && <Agentation />}
        </ReactLenis>
      </body>
    </html>
  )
}
