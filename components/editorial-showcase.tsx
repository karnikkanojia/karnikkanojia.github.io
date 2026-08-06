"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react"

import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { haptics } from "@/lib/haptics"
import type { MediumPost } from "@/lib/medium"
import { projects } from "@/lib/projects"
import { cn } from "@/lib/utils"

const BLOG_PROFILE_URL = "https://medium.com/@karnikk1406120"

type EditorialItem = {
  title: string
  description: string
  pills?: string[]
  image?: string
  imageAlt?: string
  href: string
  className?: string
  imageSizes?: string
}

function EditorialCard({
  item,
  index,
}: {
  item: EditorialItem
  index: number
}) {
  const isLead = index === 0

  function handleCardClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.detail === 0
    ) {
      return
    }

    const card = event.currentTarget
    if (card.dataset.clickAnimating === "true") {
      event.preventDefault()
      return
    }

    const opensNewTab = item.href.startsWith("http")
    if (!opensNewTab) event.preventDefault()

    card.dataset.clickAnimating = "true"
    haptics.light()

    const press = card.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.97)", offset: 0.45 },
        { transform: "scale(1)" },
      ],
      {
        duration: 200,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      }
    )

    press.finished
      .catch(() => undefined)
      .finally(() => {
        delete card.dataset.clickAnimating
        if (!opensNewTab) window.location.assign(item.href)
      })
  }

  return (
    <li
      className={cn("editorial-grid-item min-w-0", item.className)}
      data-editorial-position={index + 1}
    >
      <CursorFollowLabel
        className="group block min-w-0"
        label="View"
        icon={<ArrowUpRight aria-hidden="true" />}
      >
        <a
          href={item.href}
          aria-label={`View ${item.title}`}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          onClick={handleCardClick}
          className="editorial-card block outline-2 outline-offset-4 outline-transparent focus-visible:outline-black"
        >
          <div
            className={cn(
              "editorial-card-image relative overflow-hidden rounded-[0.9rem] bg-[#eeeeeb]",
              isLead ? "aspect-[4/3]" : "aspect-square"
            )}
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                fill
                sizes={item.imageSizes ?? "(min-width: 768px) 66vw, 100vw"}
                className="object-cover"
              />
            )}
            {item.pills?.length ? (
              <div className="editorial-card-overlay pointer-events-none absolute top-4 right-4 left-4 z-10 flex flex-col items-start gap-2">
                {item.pills.map((pill, pillIndex) => (
                  <span
                    key={`${pill}-${pillIndex}`}
                    className="editorial-card-pill rounded-full px-4 py-2 font-navbar text-xs leading-none text-[#090a2f] uppercase"
                    style={
                      {
                        "--editorial-pill-delay": `${pillIndex * 40}ms`,
                        backgroundColor: "rgba(241, 241, 241, 0.88)",
                      } as CSSProperties
                    }
                  >
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="editorial-card-details pt-4 md:pt-5">
            <h3 className="editorial-card-title text-[clamp(1.65rem,2.35vw,2.35rem)] leading-[0.98] font-medium tracking-[-0.025em] text-balance">
              {item.title}
            </h3>
            {item.description && (
              <p className="editorial-card-description mt-2 max-w-[38ch] text-sm leading-[1.42] text-black/58 md:text-base">
                {item.description}
              </p>
            )}
          </div>
        </a>
      </CursorFollowLabel>
    </li>
  )
}

function EditorialSection({
  items,
  viewMoreLabel,
  viewMoreHref,
}: {
  items: EditorialItem[]
  viewMoreLabel: string
  viewMoreHref: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const items = Array.from(
      section.querySelectorAll<HTMLElement>(".editorial-grid-item")
    )
    const activeAnimations = new Set<Animation>()

    function track(animation: Animation, onFinish: () => void) {
      activeAnimations.add(animation)
      animation.finished
        .then(() => {
          onFinish()
          animation.cancel()
        })
        .catch(() => undefined)
        .finally(() => activeAnimations.delete(animation))
    }

    function getRevealParts(item: HTMLElement) {
      const position = Number(item.dataset.editorialPosition ?? 1) - 1
      const isDesktop = window.matchMedia("(min-width: 768px)").matches
      const columnOffset = isDesktop && position < 3 ? position : 0

      return {
        arrivalDelay: columnOffset * 240,
        arrivalDistance: 52 + columnOffset * 28,
        image: item.querySelector<HTMLElement>(".editorial-card-image"),
        details: Array.from(
          item.querySelector<HTMLElement>(".editorial-card-details")
            ?.children ?? []
        ) as HTMLElement[],
      }
    }

    items.forEach((item) => {
      const { arrivalDistance, image, details } = getRevealParts(item)

      if (image) {
        image.style.clipPath = "inset(16% 0 0 0 round 0.9rem)"
        image.style.opacity = "0"
        image.style.transform = `translate3d(0, ${arrivalDistance}px, 0) scale(0.985)`
      }

      details.forEach((detail) => {
        detail.style.opacity = "0"
        detail.style.transform = "translate3d(0, 1.1rem, 0)"
      })
    })

    function playReveal(item: HTMLElement) {
      if (item.dataset.editorialRevealed === "true") return
      item.dataset.editorialRevealed = "true"

      const { arrivalDelay, arrivalDistance, image, details } =
        getRevealParts(item)

      if (image) {
        track(
          image.animate(
            [
              {
                clipPath: "inset(16% 0 0 0 round 0.9rem)",
                opacity: 0,
                transform: `translate3d(0, ${arrivalDistance}px, 0) scale(0.985)`,
              },
              {
                clipPath: "inset(0 0 0 0 round 0.9rem)",
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1)",
              },
            ],
            {
              duration: 780,
              delay: arrivalDelay,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            }
          ),
          () => {
            image.style.clipPath = "inset(0 0 0 0 round 0.9rem)"
            image.style.opacity = "1"
            image.style.transform = "translate3d(0, 0, 0) scale(1)"
          }
        )
      }

      details.forEach((detail, detailIndex) => {
        track(
          detail.animate(
            [
              { opacity: 0, transform: "translate3d(0, 1.1rem, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: 560,
              delay: arrivalDelay + 130 + detailIndex * 55,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
              fill: "both",
            }
          ),
          () => {
            detail.style.opacity = "1"
            detail.style.transform = "translate3d(0, 0, 0)"
          }
        )
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          playReveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 }
    )

    items.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      activeAnimations.forEach((animation) => animation.cancel())
      activeAnimations.clear()
    }
  }, [])

  return (
    <div ref={sectionRef}>
      <ul className="editorial-grid">
        {items.map((item, index) => (
          <EditorialCard key={item.title} item={item} index={index} />
        ))}
      </ul>
      <div className="mt-10 flex justify-end md:mt-14">
        <CursorFollowLabel
          as="span"
          label="View"
          icon={<ArrowUpRight aria-hidden="true" />}
        >
          <a
            href={viewMoreHref}
            target={viewMoreHref.startsWith("http") ? "_blank" : undefined}
            rel={viewMoreHref.startsWith("http") ? "noreferrer" : undefined}
            onClick={() => haptics.light()}
            className="editorial-view-more group -my-2 inline-flex items-center gap-2 border-b border-black/25 py-2 font-navbar text-xs tracking-[0.06em] uppercase transition-colors duration-180 active:scale-[0.98]"
          >
            {viewMoreLabel}
            <ArrowUpRight
              aria-hidden="true"
              className="editorial-view-more-arrow size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
            />
          </a>
        </CursorFollowLabel>
      </div>
    </div>
  )
}

export function ProjectsShowcase() {
  const items: EditorialItem[] = projects.map((project) => ({
    title: project.title,
    description: project.description,
    pills: project.tags,
    image: project.image,
    imageAlt: project.imageAlt,
    href: `/projects/${project.slug}`,
    imageSizes: project.homeImageSizes,
  }))

  return (
    <EditorialSection
      items={items}
      viewMoreLabel="View all projects"
      viewMoreHref="/projects"
    />
  )
}

export function BlogsShowcase({ posts }: { posts: MediumPost[] }) {
  const items: EditorialItem[] = posts.map((post) => ({
    title: post.title,
    description: "",
    pills: [
      new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
      }).format(new Date(post.publishedAt)),
      `${post.readingTimeMinutes} min read`,
    ],
    image: post.image,
    imageAlt: post.imageAlt,
    href: post.url,
    imageSizes:
      "(min-width: 1200px) 550px, (min-width: 768px) 50vw, calc(100vw - 40px)",
  }))

  return (
    <EditorialSection
      items={items}
      viewMoreLabel="View more blogs"
      viewMoreHref={BLOG_PROFILE_URL}
    />
  )
}
