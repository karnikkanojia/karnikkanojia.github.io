"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { cn } from "@/lib/utils"

type BentoItem = {
  title: string
  description: string
  meta: string
  image: string
  imageAlt: string
  href: string
  className?: string
  imageClassName?: string
}

const projects: BentoItem[] = [
  {
    title: "Ops Command Center",
    description:
      "A unified observability workspace for finding signal across incidents, services, and customer impact.",
    meta: "Observability . Platform",
    image: "/images/bento/ops-command-center.svg",
    imageAlt: "Abstract command center dashboard with service health charts",
    href: "#contact",
    className: "md:col-span-7",
  },
  {
    title: "Vision Lab",
    description:
      "An open-source imaging pipeline built to make model evaluation clear and repeatable.",
    meta: "Computer Vision . Research",
    image: "/images/bento/vision-lab.svg",
    imageAlt: "Abstract medical imaging model interface",
    href: "#contact",
    className: "md:col-span-5",
  },
  {
    title: "Changeflow",
    description:
      "Reliable data synchronization with visible checkpoints and recovery paths.",
    meta: "CDC . Automation",
    image: "/images/bento/changeflow.svg",
    imageAlt: "Abstract data synchronization flow",
    href: "#contact",
    className: "md:col-span-5",
  },
  {
    title: "Infrastructure Atlas",
    description:
      "A living map of services, dependencies, ownership, and the paths incidents travel.",
    meta: "SRE . Systems Design",
    image: "/images/bento/infrastructure-atlas.svg",
    imageAlt: "Abstract infrastructure dependency map",
    href: "#contact",
    className: "md:col-span-7",
  },
]

const posts: BentoItem[] = [
  {
    title: "Designing calm systems for noisy days",
    description:
      "A practical framework for observability that helps teams move from alert fatigue to useful context.",
    meta: "Reliability · 8 min read",
    image: "/images/bento/calm-systems.svg",
    imageAlt: "Layered waves settling into a clear signal",
    href: "#contact",
    className: "md:col-span-8",
  },
  {
    title: "The small automations that compound",
    description:
      "Why removing a few minutes of repeated operational work can change an entire team’s week.",
    meta: "Automation · 5 min read",
    image: "/images/bento/compound-automation.svg",
    imageAlt: "A sequence of automated steps growing into a larger system",
    href: "#contact",
    className: "md:col-span-4",
  },
  {
    title: "A field guide to useful alerts",
    description:
      "Writing alerts that explain what changed, why it matters, and what to do next.",
    meta: "SRE · 6 min read",
    image: "/images/bento/useful-alerts.svg",
    imageAlt: "Abstract alert signals organized into clear priorities",
    href: "#contact",
    className: "md:col-span-5",
  },
  {
    title: "What resilient data pipelines remember",
    description:
      "The checkpoints, contracts, and recovery decisions that keep data moving safely.",
    meta: "Data Systems · 7 min read",
    image: "/images/bento/resilient-pipelines.svg",
    imageAlt: "A resilient data pipeline flowing through checkpoints",
    href: "#contact",
    className: "md:col-span-7",
  },
]

function BentoCard({ item }: { item: BentoItem }) {
  return (
    <CursorFollowLabel
      className={cn("group min-w-0", item.className)}
      label="View"
      icon={<ArrowUpRight aria-hidden="true" />}
    >
      <a
        href={item.href}
        aria-label={`View ${item.title}`}
        className="bento-card flex h-full min-h-[300px] flex-col overflow-hidden rounded-[1.05rem] border border-transparent bg-[#f4f4f1] p-2 transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985] md:min-h-0"
      >
        <div
          className={cn(
            "bento-card-image relative min-h-[170px] flex-1 overflow-hidden rounded-[0.75rem] bg-[#e8e8e4] md:min-h-0",
            item.imageClassName
          )}
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
          <span className="bento-card-arrow absolute top-2.5 left-2.5 z-10 grid size-9 scale-[0.96] place-items-center rounded-[0.55rem] border border-black/8 bg-white text-black opacity-0 shadow-[0_4px_16px_rgb(0_0_0/0.08)] transition-[opacity,transform] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <ArrowUpRight aria-hidden="true" className="size-4 stroke-[1.6]" />
          </span>
        </div>
        <div className="px-2.5 pt-3.5 pb-2 md:px-3 md:pt-4 md:pb-2.5">
          <p className="bento-card-meta font-navbar text-[10px] tracking-[0.08em] text-black/48 uppercase transition-colors duration-180">
            {item.meta}
          </p>
          <h3 className="bento-card-title mt-1.5 text-[1.35rem] leading-[1.02] font-medium tracking-[-0.025em] text-balance transition-colors duration-180 md:text-[1.55rem]">
            {item.title}
          </h3>
          <p className="bento-card-description mt-2 max-w-[52ch] text-[13px] leading-[1.4] text-black/58 transition-colors duration-180">
            {item.description}
          </p>
        </div>
      </a>
    </CursorFollowLabel>
  )
}

function BentoSection({
  items,
  viewMoreLabel,
}: {
  items: BentoItem[]
  viewMoreLabel: string
}) {
  return (
    <div className="md:flex md:h-[calc(100svh-3rem)] md:min-h-[500px] md:flex-col">
      <div className="grid grid-cols-1 gap-2.5 md:min-h-0 md:flex-1 md:grid-cols-12 md:grid-rows-2 md:gap-3">
        {items.map((item) => (
          <BentoCard key={item.title} item={item} />
        ))}
      </div>
      <div className="mt-5 flex justify-end md:mt-4">
        <CursorFollowLabel
          as="span"
          label="View"
          icon={<ArrowUpRight aria-hidden="true" />}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 border-b border-black/25 pb-1 font-navbar text-[11px] tracking-[0.06em] uppercase transition-colors duration-180 hover:border-black"
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
  return <BentoSection items={projects} viewMoreLabel="View more projects" />
}

export function BlogsBento() {
  return <BentoSection items={posts} viewMoreLabel="View more blogs" />
}
