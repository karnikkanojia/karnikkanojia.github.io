"use client"

import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { animate, createTimeline, cubicBezier, stagger } from "animejs"
import { useLenis } from "lenis/react"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const RESUME_URL =
  "https://drive.google.com/file/d/1BZi0plL9zUQAPkJ0Qz4lJjMWQUvh4_v5/view?usp=sharing"

type NavbarLinkItem = {
  label: string
  href: string
  external?: boolean
}

const DESKTOP_LINKS: NavbarLinkItem[] = [
  { label: "ABOUT", href: "/#about" },
  { label: "WORK", href: "/#work" },
  { label: "PROJECTS", href: "/#projects" },
  { label: "BLOGS", href: "/#blogs" },
  { label: "RESUME", href: RESUME_URL, external: true },
]
const MOBILE_LINKS: NavbarLinkItem[] = [
  ...DESKTOP_LINKS,
  { label: "CONTACT", href: "/#contact" },
]
const DOT_OFFSETS = [
  [-4.75, -4.75],
  [4.75, -4.75],
  [-4.75, 4.75],
  [4.75, 4.75],
] as const
function getTranslation(element: HTMLElement) {
  const transform = getComputedStyle(element).transform
  const matrix =
    transform === "none" ? undefined : new DOMMatrixReadOnly(transform)

  return {
    x: matrix?.m41 ?? 0,
    y: matrix?.m42 ?? 0,
  }
}

type NavbarScrollState = {
  isFooterActive: boolean
  isVisible: boolean
  isScrolled: boolean
}

function useNavbarScrollState() {
  const [state, setState] = useState<NavbarScrollState>({
    isFooterActive: false,
    isVisible: true,
    isScrolled: false,
  })

  useEffect(() => {
    let previousScrollY = window.scrollY
    let directionStartY = previousScrollY
    let previousDirection = 0
    let footerAnchor: HTMLElement | null = null
    let heroEndY = 0
    let frameId: number | undefined

    const measureHero = () => {
      const hero = document.querySelector<HTMLElement>(
        "[data-hero-scroll-section]"
      )
      heroEndY = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY
        : window.innerHeight + 80
      footerAnchor = document.querySelector<HTMLElement>("#contact")
    }

    const update = () => {
      frameId = undefined
      const currentScrollY = window.scrollY
      const direction = Math.sign(currentScrollY - previousScrollY)

      if (direction !== 0 && direction !== previousDirection) {
        directionStartY = previousScrollY
        previousDirection = direction
      }

      const directionalDistance = currentScrollY - directionStartY
      previousScrollY = currentScrollY
      const isHeroActive = currentScrollY + window.innerHeight <= heroEndY + 1
      const isFooterActive = footerAnchor
        ? footerAnchor.getBoundingClientRect().top <= window.innerHeight
        : false

      setState((current) => {
        const isVisible = isFooterActive
          ? false
          : isHeroActive
            ? true
            : directionalDistance < -8
              ? true
              : directionalDistance > 8
                ? false
                : current.isVisible
        const isScrolled = currentScrollY > 24

        return current.isVisible === isVisible &&
          current.isFooterActive === isFooterActive &&
          current.isScrolled === isScrolled
          ? current
          : { isFooterActive, isVisible, isScrolled }
      })
    }

    const requestUpdate = () => {
      if (frameId === undefined) frameId = requestAnimationFrame(update)
    }
    const onResize = () => {
      measureHero()
      requestUpdate()
    }

    measureHero()
    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return state
}

function NavLink({ href, label, external }: NavbarLinkItem) {
  if (!external) {
    return (
      <Link
        href={href}
        className="px-2 py-2 text-xs leading-none font-light text-black transition-opacity duration-150 ease-out group-hover/nav-links:opacity-35 hover:!opacity-100"
      >
        {label}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="px-2 py-2 text-xs leading-none font-light text-black transition-opacity duration-150 ease-out group-hover/nav-links:opacity-35 hover:!opacity-100"
    >
      {label}
    </a>
  )
}

const ROOT_ROUTE_LABELS: Record<string, string> = {
  projects: "PROJECT ARCHIVE",
}

type RouteRoot = {
  href: string
  isNested: boolean
  label: string
}

function getRouteRoot(pathname: string): RouteRoot | undefined {
  const segments = pathname.split("/").filter(Boolean)
  const rootSegment = segments[0]

  if (!rootSegment) return undefined

  return {
    href: `/${rootSegment}`,
    isNested: segments.length > 1,
    label:
      ROOT_ROUTE_LABELS[rootSegment] ??
      rootSegment.replaceAll("-", " ").toUpperCase(),
  }
}

export function Navbar() {
  const logoRef = useRef<HTMLSpanElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const contactButtonRef = useRef<HTMLAnchorElement>(null)
  const contactShapeRef = useRef<HTMLSpanElement>(null)
  const contactRadiusAnimationRef = useRef<ReturnType<typeof animate> | null>(
    null
  )
  const contactDotsRef = useRef<HTMLSpanElement>(null)
  const mobileMenuDialogRef = useRef<HTMLDialogElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuCloseTimeoutRef = useRef<number | undefined>(undefined)
  const contactDotsHoverAnimationRef = useRef<ReturnType<
    typeof animate
  > | null>(null)
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [activeRouteLinkHref, setActiveRouteLinkHref] = useState<string | null>(
    null
  )
  const pathname = usePathname()
  const routeRoot = getRouteRoot(pathname)
  const isRouteLinkActive = activeRouteLinkHref === routeRoot?.href
  const lenis = useLenis()
  const {
    isFooterActive,
    isVisible: isNavbarVisible,
    isScrolled: isNavbarScrolled,
  } = useNavbarScrollState()

  useEffect(() => {
    const markIntroComplete = () => setIsIntroComplete(true)

    if (document.documentElement.dataset.siteIntroComplete === "true") {
      markIntroComplete()
      return
    }

    window.addEventListener("site-loader:complete", markIntroComplete, {
      once: true,
    })
    return () =>
      window.removeEventListener("site-loader:complete", markIntroComplete)
  }, [])

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const updateViewport = () => setIsMobileViewport(query.matches)

    updateViewport()
    query.addEventListener("change", updateViewport)
    return () => query.removeEventListener("change", updateViewport)
  }, [])

  const finishMobileMenuClose = useCallback((restoreFocus = true) => {
    if (mobileMenuCloseTimeoutRef.current !== undefined) {
      window.clearTimeout(mobileMenuCloseTimeoutRef.current)
      mobileMenuCloseTimeoutRef.current = undefined
    }

    const dialog = mobileMenuDialogRef.current
    if (dialog?.open) dialog.close()
    if (restoreFocus) mobileMenuButtonRef.current?.focus()
  }, [])

  const closeMobileMenu = useCallback(() => {
    if (mobileMenuCloseTimeoutRef.current !== undefined) {
      window.clearTimeout(mobileMenuCloseTimeoutRef.current)
    }

    setIsMobileMenuOpen(false)
    mobileMenuCloseTimeoutRef.current = window.setTimeout(
      () => finishMobileMenuClose(),
      520
    )
  }, [finishMobileMenuClose])

  const openMobileMenu = () => {
    const dialog = mobileMenuDialogRef.current
    if (!dialog || dialog.open) return

    setIsMobileMenuOpen(true)
  }

  useLayoutEffect(() => {
    if (!isMobileMenuOpen) return

    const dialog = mobileMenuDialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isFooterActive) return

    const frameId = requestAnimationFrame(() => {
      if (mobileMenuDialogRef.current?.open) closeMobileMenu()
    })
    return () => cancelAnimationFrame(frameId)
  }, [closeMobileMenu, isFooterActive])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return

      event.preventDefault()
      closeMobileMenu()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [closeMobileMenu, isMobileMenuOpen])

  useEffect(
    () => () => {
      if (mobileMenuCloseTimeoutRef.current !== undefined) {
        window.clearTimeout(mobileMenuCloseTimeoutRef.current)
      }
    },
    []
  )

  const animateContactRadius = (radius: number) => {
    const contactShape = contactShapeRef.current
    if (!contactShape) return

    contactRadiusAnimationRef.current?.cancel()
    contactRadiusAnimationRef.current = animate(contactShape, {
      borderRadius: `${radius}px`,
      duration: 380,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    })
  }

  const animateContactDotsScale = (scale: number) => {
    const contactDots = contactDotsRef.current
    if (!contactDots) return

    const dots = Array.from(contactDots.children).map(
      (cell) => cell.firstElementChild as HTMLElement
    )

    contactDotsHoverAnimationRef.current?.cancel()
    contactDotsHoverAnimationRef.current = animate(dots, {
      scale,
      duration: 320,
      delay: stagger(24),
      ease: cubicBezier(0.22, 1, 0.36, 1),
    })
  }

  const animateMobileMenuArrow = (link: HTMLAnchorElement) => {
    const arrow = link.querySelector<HTMLElement>(".mobile-menu-link-arrow")
    if (!arrow) return

    arrow.getAnimations().forEach((animation) => animation.cancel())
    arrow.animate(
      [
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
        { transform: "translate3d(10px, -10px, 0)", opacity: 0 },
        { transform: "translate3d(-10px, 10px, 0)", opacity: 0 },
        { transform: "translate3d(0, 0, 0)", opacity: 1 },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      }
    )
  }

  useLayoutEffect(() => {
    const logo = logoRef.current
    const links = linksRef.current
    const contact = contactRef.current
    const contactButton = contactButtonRef.current
    const contactDots = contactDotsRef.current
    if (!logo || !links || !contact || !contactButton || !contactDots) return

    if (window.location.pathname !== "/") {
      logo.style.visibility = "visible"
      logo.style.opacity = "1"
      logo.style.transform = "none"
      links.style.visibility = "visible"
      Array.from(links.children).forEach((link) => {
        const element = link as HTMLElement
        element.style.opacity = "1"
        element.style.transform = "none"
      })
      contact.style.visibility = "visible"
      contact.style.opacity = "1"
      contact.style.transform = "none"
      contactButton.style.removeProperty("clip-path")
      Array.from(contactDots.children).forEach((cell, index) => {
        const element = cell as HTMLElement
        const dot = element.firstElementChild as HTMLElement
        const [x, y] = DOT_OFFSETS[index] ?? [0, 0]
        element.style.transform = `translate(${x}px, ${y}px)`
        dot.style.transform = "scale(1)"
      })
      return
    }

    const clipCenterY = window.innerHeight * 0.5
    const logoRect = logo.getBoundingClientRect()
    const contactRect = contact.getBoundingClientRect()
    const navLinks = Array.from(links.children) as HTMLElement[]
    const logoStartX = logoRect.left
    const logoStartY = clipCenterY - logo.getBoundingClientRect().height / 2
    const contactStartX =
      window.innerWidth +
      contactRect.height / 2 -
      (contactRect.right - contactRect.height / 2)
    const contactStartY =
      clipCenterY - (contactRect.top + contactRect.height / 2)

    logo.style.transformOrigin = "left center"
    logo.style.transform = `translate(${logoStartX - logo.getBoundingClientRect().left - 16}px, ${logoStartY - logo.getBoundingClientRect().top}px) scale(1.45)`
    logo.style.opacity = "0"
    logo.style.visibility = "visible"
    links.style.visibility = "hidden"
    navLinks.forEach((link) => {
      link.style.opacity = "0"
      link.style.transform = "translateX(-8px)"
    })
    contact.style.transformOrigin = "right center"
    contact.style.transform = `translate(${contactStartX}px, ${contactStartY}px)`
    contact.style.opacity = "0"
    contact.style.visibility = "visible"
    contactButton.style.clipPath = "inset(0 0 0 100% round 999px)"
    Array.from(contactDots.children).forEach((cell) => {
      const element = cell as HTMLElement
      const dot = element.firstElementChild as HTMLElement
      element.style.transform = "translate(0px, 0px)"
      dot.style.transform = "scale(5.6)"
    })
  }, [])

  useEffect(() => {
    if (window.location.pathname !== "/") return

    const markNavbarSettled = () => {
      if (document.documentElement.dataset.siteNavbarSettled === "true") return

      document.documentElement.dataset.siteNavbarSettled = "true"
      window.dispatchEvent(new Event("site-loader:navbar-settled"))
    }

    const revealNavbar = () => {
      const logo = logoRef.current
      const links = linksRef.current
      const contact = contactRef.current
      const contactButton = contactButtonRef.current
      const contactDots = contactDotsRef.current
      if (!logo || !links || !contact || !contactButton || !contactDots) return

      const logoTranslation = getTranslation(logo)
      const contactTranslation = getTranslation(contact)
      const navLinks = Array.from(links.children) as HTMLElement[]
      const dotCells = Array.from(contactDots.children) as HTMLElement[]

      const timeline = createTimeline()

      timeline
        .add(
          logo,
          {
            translateX: [logoTranslation.x, 0],
            opacity: [0, 1],
            duration: 260,
            ease: "outQuad",
          },
          0
        )
        .add(
          contact,
          {
            translateX: [contactTranslation.x, 0],
            opacity: [0, 1],
            duration: 260,
            ease: "outQuad",
          },
          0
        )
        .add(
          logo,
          {
            translateY: [logoTranslation.y, 0],
            scale: [1.45, 1],
            duration: 940,
            ease: "inOutQuart",
          },
          260
        )
        .add(
          contact,
          {
            translateY: [contactTranslation.y, 0],
            duration: 940,
            ease: "inOutQuart",
            onComplete: markNavbarSettled,
          },
          260
        )

      dotCells.forEach((cell, index) => {
        const dot = cell.firstElementChild as HTMLElement
        const [x, y] = DOT_OFFSETS[index] ?? [0, 0]

        timeline
          .add(
            cell,
            {
              translateX: [0, x],
              translateY: [0, y],
              duration: 480,
              ease: cubicBezier(0.77, 0, 0.175, 1),
            },
            1200
          )
          .add(
            dot,
            {
              scale: [5.6, 1],
              duration: 480,
              ease: cubicBezier(0.77, 0, 0.175, 1),
            },
            1200
          )
      })

      timeline
        .add(
          contactButton,
          {
            clipPath: [
              "inset(0 0 0 100% round 999px)",
              "inset(0 0 0 0% round 999px)",
            ],
            duration: 480,
            ease: cubicBezier(0.77, 0, 0.175, 1),
            onComplete: () => {
              contactButton.style.removeProperty("clip-path")
            },
          },
          1200
        )
        .add(
          navLinks,
          {
            opacity: [0, 1],
            translateX: [-8, 0],
            duration: 280,
            delay: stagger(75),
            ease: "outExpo",
            onBegin: () => {
              links.style.visibility = "visible"
            },
            onComplete: () => {
              navLinks.forEach((link) => {
                link.style.removeProperty("opacity")
                link.style.removeProperty("transform")
              })
            },
          },
          1450
        )
    }

    if (document.documentElement.dataset.siteNavbarReady === "true") {
      revealNavbar()
      return
    }

    window.addEventListener("site-loader:navbar-reveal", revealNavbar, {
      once: true,
    })

    return () =>
      window.removeEventListener("site-loader:navbar-reveal", revealNavbar)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const html = document.documentElement
    const body = document.body
    const previousHtmlOverflow = html.style.overflow
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior
    const previousBodyOverflow = body.style.overflow

    lenis?.stop()
    html.style.overflow = "hidden"
    html.style.overscrollBehavior = "none"
    body.style.overflow = "hidden"

    return () => {
      lenis?.start()
      html.style.overflow = previousHtmlOverflow
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior
      body.style.overflow = previousBodyOverflow
    }
  }, [isMobileMenuOpen, lenis])

  return (
    <>
      <nav
        data-site-navbar
        aria-label="Primary"
        inert={
          !isIntroComplete ||
          isFooterActive ||
          (!isNavbarVisible && !isMobileMenuOpen)
        }
        aria-hidden={
          !isIntroComplete ||
          isFooterActive ||
          (!isNavbarVisible && !isMobileMenuOpen)
        }
        className={`fixed top-0 right-0 left-0 z-[102] flex h-14 items-center justify-between px-5 font-navbar text-black transition-transform duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] md:h-[4.125rem] md:px-6 ${
          !isFooterActive && (isNavbarVisible || isMobileMenuOpen)
            ? "translate-y-0"
            : "-translate-y-[calc(100%+0.5rem)]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="Home"
            className="flex shrink-0 items-center"
          >
            <span
              ref={logoRef}
              className="inline-flex w-fit items-center"
              style={{
                visibility: "hidden",
                opacity: 0,
              }}
            >
              <Image
                src="/typography/karnik-wordmark.svg"
                alt="Karnik Kanojia"
                width={73}
                height={22}
                className="h-5 w-auto md:h-7"
                style={{ width: "auto" }}
                priority
              />
            </span>
          </Link>
          {routeRoot && (
            <div className="flex min-w-0 translate-y-px items-center gap-3 font-navbar text-[9px] leading-none tracking-[0.08em] text-black/58 uppercase md:text-[10px]">
              <span
                aria-hidden="true"
                className="h-3.5 w-px shrink-0 bg-black/20"
              />
              {routeRoot.isNested ? (
                <CursorFollowLabel
                  as="span"
                  label="Go back"
                  className="min-w-0"
                  icon={<ArrowLeft aria-hidden="true" />}
                >
                  <Link
                    href={routeRoot.href}
                    aria-label={`Go back to ${routeRoot.label.toLowerCase()}`}
                    className="navbar-route-link relative inline-block max-w-[calc(100vw-9.5rem)] outline-2 outline-offset-4 outline-transparent transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-black active:scale-[0.97] md:max-w-60"
                    onFocus={() => setActiveRouteLinkHref(routeRoot.href)}
                    onBlur={(event) =>
                      setActiveRouteLinkHref(
                        event.currentTarget.matches(":hover")
                          ? routeRoot.href
                          : null
                      )
                    }
                    onPointerEnter={() =>
                      setActiveRouteLinkHref(routeRoot.href)
                    }
                    onPointerLeave={(event) =>
                      setActiveRouteLinkHref(
                        event.currentTarget === document.activeElement
                          ? routeRoot.href
                          : null
                      )
                    }
                    onPointerDown={() => setActiveRouteLinkHref(routeRoot.href)}
                    onPointerUp={(event) =>
                      setActiveRouteLinkHref(
                        event.pointerType === "mouse" ||
                          event.currentTarget === document.activeElement
                          ? routeRoot.href
                          : null
                      )
                    }
                    onPointerCancel={() => setActiveRouteLinkHref(null)}
                  >
                    <span className="block truncate">{routeRoot.label}</span>
                    <span
                      aria-hidden="true"
                      className="navbar-route-underline pointer-events-none absolute right-0 -bottom-[3px] left-0 h-px origin-left bg-current transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ scale: isRouteLinkActive ? "1 1" : "0 1" }}
                    />
                  </Link>
                </CursorFollowLabel>
              ) : (
                <span
                  aria-hidden="true"
                  className="max-w-[calc(100vw-9.5rem)] truncate md:max-w-60"
                >
                  {routeRoot.label}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`flex items-center gap-2 rounded-[5px] transition-[background-color,padding,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isNavbarScrolled
              ? "-translate-x-1 bg-[#f1f1f1]/92 px-3 py-2"
              : "translate-x-0 bg-transparent px-0 py-0"
          }`}
        >
          <ul
            ref={linksRef}
            className="group/nav-links hidden items-center gap-1 md:flex"
          >
            {DESKTOP_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
          <div
            ref={contactRef}
            className="inline-flex items-center gap-2.5"
            style={{ visibility: "hidden", opacity: 0 }}
          >
            <Link
              ref={contactButtonRef}
              href="/#contact"
              className="group hidden md:inline-flex"
              onPointerEnter={() => animateContactRadius(0)}
              onPointerLeave={() => animateContactRadius(14)}
            >
              <span
                ref={contactShapeRef}
                className="relative inline-flex h-7 w-[92px] items-center justify-start overflow-hidden rounded-[14px] transition-transform duration-150 ease-out will-change-transform group-active:scale-[0.97]"
              >
                <span className="absolute inset-0 bg-black" />
                <span className="absolute inset-0 z-10 inline-flex items-center justify-center text-xs leading-none font-light whitespace-nowrap text-white">
                  CONTACT
                </span>
              </span>
            </Link>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-label={
                isMobileViewport && isMobileMenuOpen
                  ? "Close navigation menu"
                  : isMobileViewport
                    ? "Open navigation menu"
                    : "Go to contact section"
              }
              aria-controls={isMobileViewport ? "mobile-navigation" : undefined}
              aria-expanded={isMobileViewport ? isMobileMenuOpen : undefined}
              className="relative isolate inline-flex size-[26px] shrink-0 transform-gpu border-0 bg-transparent p-0"
              onPointerEnter={() => animateContactDotsScale(1.25)}
              onPointerLeave={() => animateContactDotsScale(1)}
              onClick={() => {
                if (isMobileViewport) {
                  if (isMobileMenuOpen) closeMobileMenu()
                  else openMobileMenu()
                } else {
                  const contact = document.querySelector("#contact")
                  if (contact) contact.scrollIntoView({ behavior: "smooth" })
                  else window.location.href = "/#contact"
                }
              }}
            >
              <span
                ref={contactDotsRef}
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 overflow-hidden rounded-full transition-opacity duration-150 ease-out [contain:paint] ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className="absolute top-[10.5px] left-[10.5px] size-[5px]"
                  >
                    <span className="block size-full rounded-full bg-black" />
                  </span>
                ))}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`pointer-events-none absolute inset-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
                  isMobileMenuOpen
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0"
                }`}
              >
                <path
                  d="M7 7L17 17M17 7L7 17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <dialog
        ref={mobileMenuDialogRef}
        id="mobile-navigation"
        aria-label="Navigation menu"
        data-open={isMobileMenuOpen && !isFooterActive}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-[#f1f1f1] p-0 font-navbar md:hidden [&::backdrop]:bg-transparent"
        onCancel={(event) => {
          event.preventDefault()
          closeMobileMenu()
        }}
        onTransitionEnd={(event) => {
          if (
            !isMobileMenuOpen &&
            event.target === event.currentTarget &&
            event.propertyName === "transform"
          ) {
            finishMobileMenuClose()
          }
        }}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className="absolute top-4 right-5 grid size-8 place-items-center rounded-full md:hidden"
          onClick={closeMobileMenu}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
            <path
              d="M7 7L17 17M17 7L7 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
        <div className="flex h-full flex-col px-5 pt-24 pb-6">
          <nav aria-label="Mobile">
            <ul>
              {MOBILE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="mobile-menu-link group flex items-center justify-between border-b border-black/10 px-0 py-5 text-base leading-none font-light text-black transition-[background-color,color,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#1c1c1c] hover:bg-[#1c1c1c] hover:px-3 hover:text-white"
                    onPointerEnter={(event) =>
                      animateMobileMenuArrow(event.currentTarget)
                    }
                    onFocus={(event) =>
                      animateMobileMenuArrow(event.currentTarget)
                    }
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      finishMobileMenuClose(false)
                    }}
                  >
                    <span>{link.label}</span>
                    <Image
                      src="/noun-up-right-648092.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  )
}
