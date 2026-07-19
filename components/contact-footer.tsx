"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"

const navigation = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#blogs" },
]

const profiles = [
  { label: "GitHub", href: "https://github.com/karnikkanojia" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/karnikkanojia" },
  {
    label: "Resume",
    href: "https://drive.google.com/file/d/1BZi0plL9zUQAPkJ0Qz4lJjMWQUvh4_v5/view?usp=sharing",
  },
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
  const shellRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateTime = () => setNow(new Date())
    updateTime()
    const timer = window.setInterval(updateTime, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useLayoutEffect(() => {
    const shell = shellRef.current
    const footer = footerRef.current
    if (!shell || !footer) return

    let renderFrameId = 0
    let measureFrameId = 0
    let shellTop = 0
    let travel = 0

    const render = () => {
      renderFrameId = 0
      const progress =
        travel === 0
          ? 0
          : Math.min(Math.max((window.scrollY - shellTop) / travel, 0), 1)

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
      shellTop = shell.getBoundingClientRect().top + window.scrollY
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
      className="pointer-events-none relative z-0 h-[46rem] bg-[#080808] md:h-svh"
    >
      <footer
        ref={footerRef}
        className="contact-footer pointer-events-auto fixed inset-x-0 top-0 z-0 min-h-[46rem] bg-[#080808] px-5 pt-8 pb-7 text-[#f1f1ed] will-change-transform md:min-h-svh md:px-8 md:pt-10 md:pb-8"
      >
        <div className="mx-auto grid min-h-[calc(46rem-3.75rem)] max-w-[120rem] grid-cols-1 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[minmax(0,2.35fr)_minmax(17rem,1fr)] md:gap-x-20">
          <section aria-labelledby="footer-navigation-title">
            <h2
              id="footer-navigation-title"
              className="mb-9 flex items-center gap-2.5 text-[0.78rem] leading-none font-normal md:mb-10 md:text-sm"
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
                  <li key={item.href} className="border-b border-white/12">
                    <a
                      href={item.href}
                      className="footer-nav-link group flex min-h-14 items-center text-[clamp(1.8rem,3.5vw,2.8rem)] leading-none font-normal tracking-[-0.04em] md:min-h-[4.35rem]"
                    >
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className="ml-auto translate-x-[-0.35rem] opacity-0 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100"
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
              className="font-navbar text-[0.65rem] tracking-[0.08em] text-white/50 uppercase md:text-[0.7rem]"
            >
              Profile details
            </h2>

            <ul className="mt-12 space-y-1.5 md:mt-14">
              {profiles.map((profile) => (
                <li key={profile.label}>
                  <CursorFollowLabel
                    as="span"
                    className="inline-flex"
                    icon={<ArrowUpRight aria-hidden="true" />}
                    label={`Open ${profile.label}`}
                    labelClassName="[&_svg]:!size-3.5 [&_svg]:stroke-[1.75]"
                  >
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-profile-link inline-flex items-center gap-1.5 text-[1.2rem] leading-tight tracking-[-0.02em] md:text-[1.25rem]"
                    >
                      {profile.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3 md:size-4"
                      />
                    </a>
                  </CursorFollowLabel>
                </li>
              ))}
            </ul>

            <div className="mt-20 md:mt-24">
              <div className="inline-flex items-center gap-2 bg-white/6 px-2.5 py-2 text-[0.75rem] leading-none md:text-xs">
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#40d978] opacity-55" />
                  <span className="relative size-2 rounded-full bg-[#40d978] shadow-[0_0_0_3px_rgb(64_217_120/0.12)]" />
                </span>
                Open to meaningful work
              </div>

              <p className="mt-5 max-w-xs text-[0.82rem] leading-[1.3] text-white/52 md:text-sm">
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
                  className="footer-email inline-block text-[0.82rem] leading-tight underline decoration-white/60 underline-offset-3 md:text-sm"
                >
                  ↳ karnikkanojia8@gmail.com
                </a>
              </CursorFollowLabel>
            </div>
          </section>

          <div className="mt-20 grid grid-cols-1 gap-9 self-end md:col-span-2 md:mt-16 md:grid-cols-[2.35fr_1fr_1fr] md:gap-x-20 md:gap-y-0">
            <time
              dateTime={now?.toISOString()}
              className="block text-[0.78rem] leading-[1.2] tabular-nums md:text-sm"
              aria-live="off"
            >
              Lucknow {now ? timeFormatter.format(now) : "--:--:-- --"}
              <br />
              {now ? dateFormatter.format(now) : "Loading local date"} (GMT
              +05:30)
            </time>

            <div className="text-[0.78rem] leading-[1.2] md:text-sm">
              <button
                type="button"
                onClick={scrollToTop}
                className="footer-back-to-top inline-block transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              >
                Back to top ↑
              </button>
              <p className="text-white/52">
                Let&apos;s build reliable systems.
              </p>
            </div>

            <p className="self-end text-[0.78rem] leading-none md:justify-self-end md:text-right md:text-sm">
              ©{now?.getFullYear() ?? new Date().getFullYear()} Karnik Kanojia
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}
