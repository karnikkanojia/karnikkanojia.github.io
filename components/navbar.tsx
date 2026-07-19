"use client"

import { animate, createTimeline, cubicBezier, stagger } from "animejs"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

const DESKTOP_LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "PROJECTS", href: "#projects" },
  { label: "BLOGS", href: "#blogs" },
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
  isVisible: boolean
  isScrolled: boolean
}

function useNavbarScrollState() {
  const [state, setState] = useState<NavbarScrollState>({
    isVisible: true,
    isScrolled: false,
  })

  useEffect(() => {
    let previousScrollY = window.scrollY
    let directionStartY = previousScrollY
    let previousDirection = 0
    let heroEndY = 0
    let frameId: number | undefined

    const measureHero = () => {
      const hero = document.querySelector<HTMLElement>(
        "[data-hero-scroll-section]"
      )
      heroEndY = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY
        : window.innerHeight + 80
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

      setState((current) => {
        const isVisible = isHeroActive
          ? true
          : directionalDistance < -8
            ? true
            : directionalDistance > 8
              ? false
              : current.isVisible
        const isScrolled = currentScrollY > 24

        return current.isVisible === isVisible &&
          current.isScrolled === isScrolled
          ? current
          : { isVisible, isScrolled }
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

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="px-2 py-2 text-xs leading-none font-light text-black transition-opacity duration-150 ease-out group-hover/nav-links:opacity-35 hover:!opacity-100"
    >
      {label}
    </a>
  )
}

export function Navbar() {
  const logoRef = useRef<HTMLSpanElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const contactButtonRef = useRef<HTMLAnchorElement>(null)
  const contactShapeRef = useRef<HTMLSpanElement>(null)
  const contactRadiusAnimationRef = useRef<ReturnType<typeof animate> | null>(
    null
  )
  const contactDotsRef = useRef<HTMLSpanElement>(null)
  const contactDotsHoverAnimationRef = useRef<ReturnType<
    typeof animate
  > | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isVisible: isNavbarVisible, isScrolled: isNavbarScrolled } =
    useNavbarScrollState()

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
    logo.style.filter = "brightness(0)"
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
          logo,
          {
            filter: "brightness(0)",
            duration: 300,
            ease: "inOutQuad",
          },
          520
        )
        .add(
          contact,
          {
            translateY: [contactTranslation.y, 0],
            duration: 940,
            ease: "inOutQuart",
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

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isMobileMenuOpen])

  return (
    <>
    <nav
      data-site-navbar
      className={`fixed top-0 right-0 left-0 z-[102] flex h-14 items-center justify-between px-5 font-navbar text-black transition-transform duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] md:h-[4.125rem] md:px-6 ${
        isNavbarVisible || isMobileMenuOpen
          ? "translate-y-0"
          : "-translate-y-[calc(100%+0.5rem)]"
      }`}
    >
      <a href="#" aria-label="Home" className="flex items-center">
        <span
          ref={logoRef}
          className="inline-flex w-fit items-center"
          style={{
            visibility: "hidden",
            opacity: 0,
            filter: "brightness(0)",
          }}
        >
          <Image
            src="/monogram.svg"
            alt="Karnik Kanojia"
            width={72}
            height={20}
            className="h-5 w-auto"
            style={{ width: "auto" }}
            priority
          />
        </span>
      </a>
      <div
        className={`flex items-center gap-2 rounded-[5px] transition-[background-color,padding,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isNavbarScrolled
            ? "-translate-x-1 bg-[#f1f1f1] px-3 py-2"
            : "translate-x-0 bg-transparent px-0 py-0"
        }`}
      >
        <div
          ref={linksRef}
          className="group/nav-links hidden items-center gap-1 md:flex"
        >
          {DESKTOP_LINKS.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>
        <div
          ref={contactRef}
          className="inline-flex items-center gap-2.5"
          style={{ visibility: "hidden", opacity: 0 }}
        >
          <a
            ref={contactButtonRef}
            href="#contact"
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
          </a>
          <button
            type="button"
            aria-label={
              isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            className="relative isolate inline-flex size-[26px] shrink-0 border-0 bg-transparent p-0 transform-gpu"
            onPointerEnter={() => animateContactDotsScale(1.25)}
            onPointerLeave={() => animateContactDotsScale(1)}
            onClick={() => {
              if (window.matchMedia("(max-width: 767px)").matches) {
                setIsMobileMenuOpen((isOpen) => !isOpen)
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
      <div
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-[101] bg-[#f1f1f1] px-5 pt-24 pb-6 font-navbar md:hidden ${
          isMobileMenuOpen ? "" : "pointer-events-none"
        }`}
        style={{
          opacity: isMobileMenuOpen ? 1 : 0,
          transform: isMobileMenuOpen
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, -100%, 0)",
          transition:
            "transform 460ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease-out",
          willChange: "transform",
        }}
      >
        <div className="flex h-full flex-col">
          <div>
          {DESKTOP_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu-link group flex items-center justify-between border-b border-black/10 px-0 py-5 text-base leading-none font-light text-black transition-[background-color,color,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#1c1c1c] hover:bg-[#1c1c1c] hover:px-3 hover:text-white"
              tabIndex={isMobileMenuOpen ? 0 : -1}
              onPointerEnter={(event) =>
                animateMobileMenuArrow(event.currentTarget)
              }
              onFocus={(event) => animateMobileMenuArrow(event.currentTarget)}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{link.label}</span>
              <Image
                src="/noun-up-right-648092.svg"
                alt=""
                width={16}
                height={16}
                className="mobile-menu-link-arrow size-4 transition-filter duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:invert"
              />
            </a>
          ))}
          </div>
          <a
            href="#contact"
            className="mt-auto inline-flex h-10 w-fit items-center rounded-[14px] bg-black px-5 text-xs leading-none font-light text-white transition-transform duration-150 ease-out active:scale-[0.97]"
            tabIndex={isMobileMenuOpen ? 0 : -1}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTACT
          </a>
        </div>
      </div>
    </>
  )
}
