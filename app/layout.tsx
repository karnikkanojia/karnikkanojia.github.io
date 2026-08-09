import type { Metadata, Viewport } from "next"
import "./globals.css"
import localFont from "next/font/local"
import Script from "next/script"
import { Agentation } from "agentation"
import { ReactLenis } from "lenis/react"

import { ContactFooter } from "@/components/contact-footer"
import { CursorProvider } from "@/components/cursor-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

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
  src: "../fonts/Messina/MessinaSansMonoWeb-Regular.woff2",
  variable: "--font-messina-sans-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  keywords: [
    "Karnik Kanojia",
    "Site Reliability Engineer",
    "SRE",
    "DevOps",
    "Cloud Infrastructure",
    "Automation",
    "Data Science",
    "Oracle",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/typography/karnik-k.svg",
    shortcut: "/typography/karnik-k.svg",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/videos/intro-poster.webp",
        width: 1440,
        height: 810,
        alt: `${SITE_NAME} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/videos/intro-poster.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/typography/karnik-k.svg`,
  jobTitle: "Site Reliability Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Oracle",
  },
  sameAs: [
    "https://github.com/karnikkanojia",
    "https://www.linkedin.com/in/karnikkanojia",
    "https://medium.com/@karnikk1406120",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", khTeka.variable, messinaSansMono.variable)}
    >
      <head>
        <style>{`
          html:not([data-site-intro-active]) [data-site-intro],
          html[data-site-skip-intro] [data-site-intro] {
            display: none !important;
          }
        `}</style>
        <link
          rel="preload"
          as="image"
          href="/videos/intro-poster.webp"
          fetchPriority="high"
        />
      </head>
      <body id="custom-cursor-root">
        <CursorProvider>
          <noscript>
            <style>{`
              html, body { overflow: auto !important; overscroll-behavior: auto !important; }
              [data-site-intro] { display: none !important; }
            `}</style>
          </noscript>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
          <Script id="initial-scroll-position" strategy="beforeInteractive">
            {`try { const hasSeenIntro = window.sessionStorage.getItem("portfolio:intro-complete") === "true"; const skipIntroOnce = window.sessionStorage.getItem("portfolio:skip-intro-once") === "true"; if (skipIntroOnce) window.sessionStorage.removeItem("portfolio:skip-intro-once"); if (hasSeenIntro || skipIntroOnce) { document.documentElement.dataset.siteSkipIntro = "true"; document.documentElement.dataset.siteIntroComplete = "true"; document.documentElement.dataset.siteNavbarReady = "true"; } } catch {} if (window.location.pathname !== "/") { document.documentElement.dataset.siteIntroComplete = "true"; document.documentElement.dataset.siteNavbarReady = "true"; } else if (document.documentElement.dataset.siteSkipIntro !== "true") { document.documentElement.dataset.siteIntroActive = "true"; } if (!window.location.hash) { window.history.scrollRestoration = "manual"; const resetInitialScroll = () => { if (window.matchMedia("(max-width: 767px)").matches && !window.location.hash) window.scrollTo(0, 0); }; window.scrollTo(0, 0); window.requestAnimationFrame(resetInitialScroll); window.addEventListener("pageshow", resetInitialScroll); }`}
          </Script>
          <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: 0.1 }}>
            <Navbar />
            {children}
            <ContactFooter />
          </ReactLenis>
          {process.env.NODE_ENV === "development" && <Agentation />}
        </CursorProvider>
      </body>
    </html>
  )
}
