"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { SpotlightLogo } from "@/components/spotlight-logo"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"

const navigation = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Projects", href: "/#projects" },
  { label: "Blogs", href: "/#blogs" },
]

const profileRows = [
  [
    { label: "GitHub", href: "https://github.com/karnikkanojia" },
    { label: "X", href: "https://x.com/KanojiaKarnik" },
  ],
  [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/karnikkanojia" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/karnikkanojia/",
    },
  ],
]

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
})

export function ContactFooter() {
  const [now, setNow] = useState<Date | null>(null)
  const [isInteractive, setIsInteractive] = useState(false)
  const shellRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateTime = () => setNow(new Date())
    updateTime()
    const timer = window.setInterval(updateTime, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInteractive(entry?.isIntersecting ?? false),
      { threshold: 0.01 }
    )

    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const shell = shellRef.current
    const footer = footerRef.current
    if (!shell || !footer) return

    let renderFrameId = 0
    let measureFrameId = 0
    let travel = 0

    const render = () => {
      renderFrameId = 0
      const shellViewportTop = shell.getBoundingClientRect().top
      const progress =
        travel === 0 ? 0 : Math.min(Math.max(-shellViewportTop / travel, 0), 1)

      footer.style.transform = `translate3d(0, ${-travel * progress}px, 0)`
    }

    const requestRender = () => {
      if (renderFrameId) return
      renderFrameId = window.requestAnimationFrame(render)
    }

    const measure = () => {
      measureFrameId = 0
      const footerHeight = footer.offsetHeight

      shell.style.height = `${footerHeight}px`
      travel = Math.max(footerHeight - window.innerHeight, 0)
      render()
    }

    const requestMeasure = () => {
      if (measureFrameId) return
      measureFrameId = window.requestAnimationFrame(measure)
    }

    const resizeObserver = new ResizeObserver(requestMeasure)
    resizeObserver.observe(footer)
    window.addEventListener("resize", requestMeasure)
    window.addEventListener("scroll", requestRender, { passive: true })
    measure()

    return () => {
      if (renderFrameId) window.cancelAnimationFrame(renderFrameId)
      if (measureFrameId) window.cancelAnimationFrame(measureFrameId)
      resizeObserver.disconnect()
      window.removeEventListener("resize", requestMeasure)
      window.removeEventListener("scroll", requestRender)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section
      ref={shellRef}
      id="contact"
      className="pointer-events-none relative z-0 h-184 bg-[#080808] md:h-svh"
    >
      <footer
        ref={footerRef}
        inert={!isInteractive}
        aria-hidden={!isInteractive}
        className={`contact-footer pointer-events-auto fixed inset-x-0 top-0 z-0 min-h-184 bg-[#080808] px-5 pt-8 pb-7 text-[#f1f1ed] will-change-transform md:min-h-svh md:px-8 md:pt-10 md:pb-8 ${
          isInteractive ? "visible" : "invisible"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="pointer-events-auto absolute top-1/2 right-[-18vw] w-[88vw] max-w-104 -translate-y-1/2 [--background:#080808] sm:top-auto sm:right-auto sm:-bottom-16 sm:left-1/2 sm:w-[clamp(30rem,50vw,40rem)] sm:max-w-none sm:-translate-x-1/2 sm:translate-y-0">
            <SpotlightLogo />
          </div>
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid min-h-169 max-w-480 grid-cols-1 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[minmax(0,2.35fr)_minmax(17rem,1fr)] md:gap-x-20 [&_.cursor-follow-target]:pointer-events-auto [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
          <section aria-labelledby="footer-navigation-title">
            <h2
              id="footer-navigation-title"
              className="mb-9 flex items-center gap-2.5 text-xs leading-none font-normal md:mb-10"
            >
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#4a8dff] opacity-55" />
                <span className="relative size-2 rounded-full bg-[#4a8dff] shadow-[0_0_0_3px_rgb(74_141_255/0.12)]" />
              </span>
              Navigation
            </h2>

            <nav aria-label="Footer navigation">
              <ul>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="footer-nav-link group inline-flex min-h-14 origin-left items-center text-2xl leading-none font-normal tracking-[-0.04em] active:scale-[0.98] md:min-h-[4.35rem] md:text-4xl"
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className="footer-nav-arrow ml-2 translate-x-[-0.35rem] opacity-0 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      >
                        <Image
                          src="/noun-up-right-648092.svg"
                          alt=""
                          width={18}
                          height={18}
                          className="size-3.5 invert md:size-4"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          <section
            aria-labelledby="footer-details-title"
            className="mt-16 md:mt-0"
          >
            <h2
              id="footer-details-title"
              className="font-navbar text-xs tracking-[0.08em] text-white/50 uppercase"
            >
              Profile details
            </h2>

            <div className="mt-12 flex flex-col items-start gap-2 md:mt-14">
              {profileRows.map((row, rowIndex) => (
                <ul key={rowIndex} className="flex flex-nowrap gap-2">
                  {row.map((profile) => (
                    <li key={profile.label}>
                      <a
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-profile-link inline-flex min-h-9 origin-left items-center justify-center rounded-[18px] bg-[#252724] px-4 py-1.5 font-navbar text-sm leading-none font-normal tracking-[-0.01em] text-[#f1f1ed] uppercase hover:rounded-none focus-visible:rounded-none active:scale-[0.97]"
                      >
                        {profile.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="mt-20 md:mt-24">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-2.5 py-2 text-xs leading-none backdrop-blur-sm">
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#40d978] opacity-55" />
                  <span className="relative size-2 rounded-full bg-[#40d978] shadow-[0_0_0_3px_rgb(64_217_120/0.12)]" />
                </span>
                Open to meaningful work
              </div>

              <p className="mt-5 max-w-xs text-xs leading-[1.3] text-white/52">
                Based in Lucknow, India.
                <br />
                Working worldwide.
              </p>

              <CursorFollowLabel
                as="span"
                className="mt-7 inline-flex"
                icon={<ArrowUpRight aria-hidden="true" />}
                label="Send email"
                labelClassName="[&_svg]:!size-3.5 [&_svg]:stroke-[1.75]"
              >
                <a
                  href="mailto:karnikkanojia8@gmail.com"
                  className="footer-email inline-block origin-left py-1 text-base leading-tight underline decoration-white/60 underline-offset-3 active:scale-[0.97]"
                >
                  ↳ karnikkanojia8@gmail.com
                </a>
              </CursorFollowLabel>
            </div>
          </section>

          <div className="mt-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-2 self-end md:col-span-2 md:mt-16 md:grid-cols-[2.35fr_1fr_1fr] md:gap-x-20 md:gap-y-0">
            <time
              dateTime={now?.toISOString()}
              className="block text-xs leading-[1.2] whitespace-nowrap tabular-nums"
              aria-live="off"
            >
              Lucknow {now ? timeFormatter.format(now) : "--:--:-- --"}
              <br />
              {now ? dateFormatter.format(now) : "Loading local date"} (GMT
              +05:30)
            </time>

            <div className="flex flex-col items-end gap-5 text-right md:col-start-3 md:justify-self-end">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="footer-back-to-top relative inline-flex size-9 items-center justify-center rounded-[11px] bg-[#f1f1ed] text-[#080808] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] after:absolute after:-inset-1.5 active:scale-[0.97]"
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </button>

              <p className="text-xs leading-none whitespace-nowrap">
                ©{now?.getFullYear() ?? new Date().getFullYear()} Karnik Kanojia
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
