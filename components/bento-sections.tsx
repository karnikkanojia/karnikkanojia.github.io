"use client"

import Image from "next/image"
import { ArrowUpRight, PanelsTopLeft } from "lucide-react"
import { createLayout } from "animejs"
import { useEffect, useRef, useState } from "react"

import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import type { MediumPost } from "@/lib/medium"
import { projects } from "@/lib/projects"
import { cn } from "@/lib/utils"

const MEDIUM_PROFILE_URL = "https://medium.com/@karnikk1406120"

type BentoItem = {
  title: string
  description: string
  meta?: string
  pills?: string[]
  image?: string
  imageAlt?: string
  href: string
  className?: string
  alternateSpan?: 4 | 5 | 7 | 8 | 12
  imageClassName?: string
  imageSizes?: string
}

function BentoCard({ item }: { item: BentoItem }) {
  return (
    <li
      className={cn("min-w-0", item.className)}
      data-alternate-span={item.alternateSpan}
    >
      <CursorFollowLabel
        className="group h-full min-w-0"
        label="View"
        icon={<ArrowUpRight aria-hidden="true" />}
      >
        <a
          href={item.href}
          aria-label={`View ${item.title}`}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          className="bento-card flex h-full min-h-75 flex-col overflow-hidden rounded-[1.05rem] border border-transparent bg-[#f4f4f1] p-2 transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] md:min-h-0"
        >
          <div
            className={cn(
              "bento-card-image relative min-h-42.5 flex-1 overflow-hidden rounded-[0.75rem] bg-[#e8e8e4] md:min-h-0",
              item.imageClassName
            )}
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                fill
                sizes={item.imageSizes ?? "(min-width: 768px) 66vw, 100vw"}
                className="object-cover transition-transform duration-240 ease-[cubic-bezier(0.23,1,0.32,1)]"
              />
            )}
            <span className="bento-card-arrow absolute top-2.5 left-2.5 z-10 grid size-9 scale-[0.96] place-items-center rounded-3xl border border-black/8 bg-white text-black opacity-0 shadow-[0_4px_16px_rgb(0_0_0/0.08)] transition-[opacity,transform] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 stroke-[1.6]"
              />
            </span>
          </div>
          <div className="px-2.5 pt-3.5 pb-2 md:px-3 md:pt-4 md:pb-2.5">
            {item.pills?.length ? (
              <div className="bento-card-meta flex flex-wrap gap-1.5 transition-colors duration-180">
                {item.pills.map((pill, pillIndex) => (
                  <span
                    key={`${pill}-${pillIndex}`}
                    className="inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 font-navbar text-xs tracking-wide text-muted-foreground uppercase transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-[0.96] group-active:border-black/30 group-active:bg-black/5"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="bento-card-meta font-navbar text-xs tracking-[0.08em] text-black/48 uppercase transition-colors duration-180">
                {item.meta}
              </p>
            )}
            <h3 className="bento-card-title mt-1.5 text-2xl leading-[1.02] font-medium tracking-tight text-balance transition-colors duration-180">
              {item.title}
            </h3>
            {item.description && (
              <p className="bento-card-description mt-2 max-w-[52ch] text-xs leading-[1.4] text-black/58 transition-colors duration-180">
                {item.description}
              </p>
            )}
          </div>
        </a>
      </CursorFollowLabel>
    </li>
  )
}

function BentoSection({
  items,
  viewMoreLabel,
  viewMoreHref,
}: {
  items: BentoItem[]
  viewMoreLabel: string
  viewMoreHref: string
}) {
  const gridRef = useRef<HTMLUListElement>(null)
  const layoutRef = useRef<ReturnType<typeof createLayout> | null>(null)
  const [layout, setLayout] = useState<"overview" | "alternate">("overview")

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const autoLayout = createLayout(grid, {
      children: Array.from(grid.querySelectorAll<HTMLLIElement>(":scope > li")),
      duration: 280,
      ease: "out(4)",
    })

    layoutRef.current = autoLayout

    return () => {
      autoLayout.revert()
      layoutRef.current = null
    }
  }, [])

  function toggleLayout() {
    const nextLayout = layout === "overview" ? "alternate" : "overview"
    const autoLayout = layoutRef.current

    if (!autoLayout) {
      setLayout(nextLayout)
      return
    }

    autoLayout.update(({ root }) => {
      root.dataset.layout = nextLayout
    })
    setLayout(nextLayout)
  }

  return (
    <div className="md:flex md:h-[calc(100svh-3rem)] md:min-h-125 md:flex-col">
      <ul
        ref={gridRef}
        data-layout={layout}
        className="bento-layout grid grid-cols-1 gap-2.5 md:min-h-0 md:flex-1 md:grid-cols-12 md:grid-rows-2 md:gap-3"
      >
        {items.map((item) => (
          <BentoCard key={item.title} item={item} />
        ))}
      </ul>
      <div className="mt-5 flex items-center justify-between md:mt-4">
        <button
          type="button"
          onClick={toggleLayout}
          className="group hidden items-center gap-2 border-b border-black/25 pb-1 font-navbar text-xs tracking-[0.06em] uppercase transition-colors duration-180 hover:border-black active:scale-[0.98] md:inline-flex"
          aria-pressed={layout === "alternate"}
        >
          <PanelsTopLeft aria-hidden="true" className="size-3.5" />
          {layout === "overview" ? "Rearrange" : "Reset layout"}
        </button>
        <CursorFollowLabel
          as="span"
          label="View"
          icon={<ArrowUpRight aria-hidden="true" />}
        >
          <a
            href={viewMoreHref}
            target={viewMoreHref.startsWith("http") ? "_blank" : undefined}
            rel={viewMoreHref.startsWith("http") ? "noreferrer" : undefined}
            className="group inline-flex items-center gap-2 border-b border-black/25 pb-1 font-navbar text-xs tracking-[0.06em] uppercase transition-colors duration-180 hover:border-black active:scale-[0.98]"
          >
            {viewMoreLabel}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </CursorFollowLabel>
      </div>
    </div>
  )
}

export function ProjectsBento() {
  const items: BentoItem[] = projects.map((project, index) => ({
    title: project.title,
    description: project.description,
    pills: project.tags,
    image: project.image,
    imageAlt: project.imageAlt,
    href: `/projects/${project.slug}`,
    className: project.homeClassName,
    alternateSpan: index % 2 === 0 ? 5 : 7,
    imageSizes: project.homeImageSizes,
  }))

  return (
    <BentoSection
      items={items}
      viewMoreLabel="View all projects"
      viewMoreHref="/projects"
    />
  )
}

export function BlogsBento({ posts }: { posts: MediumPost[] }) {
  const items: BentoItem[] = posts.map((post, index) => ({
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
    className:
      posts.length === 1
        ? "md:col-span-12"
        : index % 2 === 0
          ? "md:col-span-8"
          : "md:col-span-4",
    alternateSpan: posts.length === 1 ? 12 : index % 2 === 0 ? 4 : 8,
    imageSizes:
      posts.length === 1
        ? "(min-width: 1200px) 1120px, calc(100vw - 40px)"
        : index % 2 === 0
          ? "(min-width: 1200px) 740px, (min-width: 768px) 66vw, calc(100vw - 40px)"
          : "(min-width: 1200px) 360px, (min-width: 768px) 34vw, calc(100vw - 40px)",
  }))

  return (
    <BentoSection
      items={items}
      viewMoreLabel="View more blogs"
      viewMoreHref={MEDIUM_PROFILE_URL}
    />
  )
}
