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

const viewTransitionLifecycleScript = String.raw`
  (() => {
    const navigationContextKey = "portfolio:view-transition-navigation"

    const getPath = (url) => {
      if (!url) return ""

      try {
        return new URL(url, window.location.href).pathname
      } catch {
        return ""
      }
    }

    const getProjectSlug = (url) =>
      getPath(url).match(/^\/projects\/([^/]+)\/?$/)?.[1] ?? null

    const getProjectImages = () =>
      Array.from(document.querySelectorAll("[data-project-transition-image]"))

    const saveNavigationContext = (sourceUrl, destinationUrl) => {
      try {
        window.sessionStorage.setItem(
          navigationContextKey,
          JSON.stringify({ sourceUrl, destinationUrl })
        )
      } catch {}
    }

    const readNavigationContext = () => {
      try {
        const value = window.sessionStorage.getItem(navigationContextKey)
        window.sessionStorage.removeItem(navigationContextKey)
        if (!value) return null

        const context = JSON.parse(value)
        return getPath(context.destinationUrl) === window.location.pathname
          ? context
          : null
      } catch {
        return null
      }
    }

    const watchViewTransition = (event) => {
      const transition = event.viewTransition
      if (!transition) return

      transition.ready.catch((error) => {
        if (error?.name !== "AbortError") console.error(error)
      })
    }

    const nameProjectImages = (event, images) => {
      const transition = event.viewTransition
      if (!transition || images.length === 0) return

      document.documentElement.dataset.projectTransitionImages = images
        .map((image) => image.dataset.projectTransitionImage)
        .filter(Boolean)
        .join(" ")

      const cleanup = () => {
        delete document.documentElement.dataset.projectTransitionImages
      }

      transition.finished.then(cleanup, cleanup)
    }

    const nameProjectImage = (event, slug) => {
      if (!slug) return

      nameProjectImages(
        event,
        getProjectImages().filter(
          (image) => image.dataset.projectTransitionImage === slug
        )
      )
    }

    window.addEventListener("pageswap", (event) => {
      watchViewTransition(event)

      const activation = event.activation
      if (!activation) return

      const sourceUrl = activation.from?.url ?? window.location.href
      const destinationUrl = activation.entry?.url
      const sourcePath = getPath(sourceUrl)
      const destinationPath = getPath(destinationUrl)

      saveNavigationContext(sourceUrl, destinationUrl)

      if (sourcePath === "/" && destinationPath === "/projects") {
        nameProjectImages(event, getProjectImages())
        return
      }

      const destinationSlug = getProjectSlug(destinationUrl)
      const sourceSlug = getProjectSlug(sourceUrl)
      const slug =
        destinationSlug ??
        (destinationPath === "/" || destinationPath === "/projects"
          ? sourceSlug
          : null)

      nameProjectImage(event, slug)
    })

    window.addEventListener("pagereveal", (event) => {
      watchViewTransition(event)

      // PageRevealEvent has no activation property. The incoming document's
      // activation data lives on the Navigation API instead.
      const activation = window.navigation?.activation
      const navigationContext = readNavigationContext()
      const sourceUrl = activation?.from?.url ?? navigationContext?.sourceUrl
      const sourcePath = getPath(sourceUrl)

      if (sourcePath === "/" && window.location.pathname === "/projects") {
        nameProjectImages(event, getProjectImages())
        return
      }

      const currentSlug = getProjectSlug(window.location.href)
      const sourceSlug = getProjectSlug(sourceUrl)
      const slug =
        currentSlug ??
        (window.location.pathname === "/" ||
        window.location.pathname === "/projects"
          ? sourceSlug
          : null)

      nameProjectImage(event, slug)
    })
  })()
`

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
        <script
          id="view-transition-lifecycle"
          dangerouslySetInnerHTML={{ __html: viewTransitionLifecycleScript }}
        />
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
          <ReactLenis
            root
            options={{ anchors: true, autoRaf: true, lerp: 0.1 }}
          >
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
