"use client"

import { useCallback, useEffect, useRef, type ComponentProps } from "react"
import { animate, createTimeline, cubicBezier, remove } from "animejs"
import { differenceInMonths, parse } from "date-fns"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { ChevronsUpDownIconHandle } from "@/components/chevrons-up-down-icon"
import { ChevronsUpDownIcon } from "@/components/chevrons-up-down-icon"
import { ArrowUpRightIcon, CodeXmlIcon } from "lucide-react"

export type ExperiencePositionItemType = {
  /** Unique identifier for the position */
  id: string
  /** The job title or position name */
  title: string
  /**
   * Employment period of the position.
   * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
   */
  employmentPeriod: {
    /** Start date (e.g., "10.2022" or "2020"). */
    start: string
    /** End date; leave undefined for "Present". */
    end?: string
  }
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string
  /** A brief description of the position or responsibilities */
  description?: string
  /** An icon representing the position */
  icon?: React.ReactElement
  /** A list of skills associated with the position */
  skills?: string[]
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean
}

export type ExperienceItemType = {
  /** Unique identifier for the experience item */
  id: string
  /** Name of the company where the experience was gained */
  companyName: string
  /** URL or path to the company's logo image */
  companyLogo?: string
  /** URL to the company's website. */
  companyWebsite?: string
  /**
   * List of positions held at the company
   * @fumadocsHref #experiencepositionitemtype
   * */
  positions: ExperiencePositionItemType[]
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean
}

export type WorkExperienceProps = {
  className?: string
  /** @fumadocsHref #experienceitemtype */
  experiences: ExperienceItemType[]
}

export function WorkExperience({
  className,
  experiences,
}: WorkExperienceProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const items = Array.from(
      list.querySelectorAll<HTMLElement>("[data-work-experience-company]")
    )
    const positionItems = Array.from(
      list.querySelectorAll<HTMLElement>("[data-work-experience-position]")
    )
    const revealAnimations: ReturnType<typeof animate>[] = []
    const trailTimelines = new Map<
      HTMLElement,
      ReturnType<typeof createTimeline>
    >()
    let animationFrame: number | undefined

    items.forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(24px)"
    })

    positionItems.forEach((item) => {
      const verticalTrail = item.querySelector<HTMLElement>(
        "[data-work-experience-trail-progress]"
      )
      const horizontalTrail = item.querySelector<HTMLElement>(
        "[data-work-experience-skill-trail-progress]"
      )
      if (!verticalTrail) return

      const verticalDuration = horizontalTrail ? 860 : 1_000
      const timeline = createTimeline({ autoplay: false })
      timeline.add(
        verticalTrail,
        {
          scaleY: [0, 1],
          duration: verticalDuration,
          ease: "linear",
        },
        0
      )

      if (horizontalTrail) {
        timeline.add(
          horizontalTrail,
          {
            scaleX: [0, 1],
            duration: 140,
            ease: "linear",
          },
          verticalDuration
        )
      }

      timeline.seek(0, true)
      trailTimelines.set(item, timeline)
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const item = entry.target as HTMLElement
          const animation = animate(item, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 560,
            ease: cubicBezier(0.16, 1, 0.3, 1),
          })
          revealAnimations.push(animation)
          observer.unobserve(item)
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    )

    items.forEach((item) => observer.observe(item))

    const updateTrailProgress = () => {
      const viewportHeight = window.innerHeight
      positionItems.forEach((item) => {
        const { top, height } = item.getBoundingClientRect()
        const startLine = viewportHeight * 0.82
        const endLine = viewportHeight * 0.18
        const travelDistance = Math.max(1, height + startLine - endLine)
        const progress = Math.min(
          1,
          Math.max(0, (startLine - top) / travelDistance)
        )
        const timeline = trailTimelines.get(item)
        if (timeline) timeline.seek(timeline.duration * progress, true)
      })
    }

    const handleScroll = () => {
      if (animationFrame !== undefined) return
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = undefined
        updateTrailProgress()
      })
    }

    updateTrailProgress()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
      revealAnimations.forEach((animation) => animation.cancel())
      trailTimelines.forEach((timeline) => timeline.cancel())
      remove(items)
      items.forEach((item) => {
        item.style.opacity = ""
        item.style.transform = ""
      })
    }
  }, [experiences])

  return (
    <div
      ref={listRef}
      className={cn(
        "mx-auto w-full max-w-3xl bg-background px-4 text-foreground font-sans",
        className
      )}
    >
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </div>
  )
}

export type ExperienceItemProps = {
  experience: ExperienceItemType
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div data-work-experience-company className="space-y-4 py-4">
      <div className="not-prose flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center">
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-full"
              aria-hidden
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <h3 className="text-lg leading-snug font-medium">
          {experience.companyWebsite ? (
            <CursorFollowLabel
              as="span"
              className="inline-flex"
              icon={<ArrowUpRightIcon />}
              labelClassName="[&_svg]:!size-3.5 [&_svg]:stroke-[1.75]"
              label={`Visit ${experience.companyName}`}
            >
              <a
                className="link inline-flex items-center gap-1"
                href={experience.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                {experience.companyName}
                <Image
                  src="/noun-up-right-648092.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="size-3 opacity-70"
                  aria-hidden
                />
              </a>
            </CursorFollowLabel>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <span
            className="relative flex items-center justify-center"
            aria-label="Current Employer"
          >
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-sky-500 opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
          </span>
        )}
      </div>

      <div className="space-y-4 text-left">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  )
}

export type ExperiencePositionItemProps = {
  position: ExperiencePositionItemType
}

export function ExperiencePositionItem({
  position,
}: ExperiencePositionItemProps) {
  const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null)

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsUpDownIconRef.current
    if (!controls) return

    if (open) {
      controls.startAnimation()
    } else {
      controls.stopAnimation()
    }
  }, [])

  const { start, end } = position.employmentPeriod
  const isOngoing = !end
  const duration = formatDuration(start, end)
  const skills = position.skills ?? []
  const hasSkills = skills.length > 0

  return (
    <Collapsible
      defaultOpen={position.isExpanded}
      onOpenChange={handleOpenChange}
      disabled={!position.description}
      asChild
    >
      <div data-work-experience-position className="relative">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-3 left-3 z-0 w-px overflow-hidden bg-black/15",
            hasSkills ? "bottom-[10px]" : "bottom-0"
          )}
        >
          <span
            data-work-experience-trail-progress
            className="absolute inset-0 origin-top bg-black"
            style={{ transform: "scaleY(0)" }}
          />
        </span>
        <CollapsibleTrigger
          className={cn(
            "group/experience-position not-prose block w-full text-left select-none",
            "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/30",
            "data-disabled:before:content-none"
          )}
        >
          <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg",
                "bg-muted text-muted-foreground",
                "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
            >
              {position.icon ?? <CodeXmlIcon />}
            </div>

            <h4 className="flex-1 font-medium text-balance text-foreground">
              {position.title}
            </h4>

            <div className="shrink-0 text-muted-foreground group-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
              <ChevronsUpDownIcon
                ref={chevronsUpDownIconRef}
                duration={0.15}
                initialOpen={position.isExpanded}
              />
            </div>
          </div>

          <dl className="relative z-1 flex items-center gap-2 pl-9 font-navbar text-xs tracking-wide text-muted-foreground uppercase">
            {position.employmentType && (
              <>
                <div>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </div>

                <span aria-hidden>-</span>
              </>
            )}

            <div>
              <dt className="sr-only">Employment Period</dt>
              <dd className="flex items-center gap-0.5 tabular-nums">
                <span>{start}</span>
                <span>.</span>
                <span>{isOngoing ? "Present" : end}</span>
              </dd>
            </div>

            {duration && (
              <>
                <span aria-hidden>-</span>
                <div>
                  <dt className="sr-only">Duration</dt>
                  <dd className="tabular-nums">{duration}</dd>
                </div>
              </>
            )}
          </dl>
        </CollapsibleTrigger>

        <CollapsibleContent className="relative z-1 overflow-hidden">
          {position.description && (
            <Prose className="prose-sm pt-2 pl-9 prose-p:my-1.5 prose-p:leading-[1.4] prose-ul:my-1.5 prose-li:my-1 prose-li:leading-[1.4]">
              <ReactMarkdown>{position.description}</ReactMarkdown>
            </Prose>
          )}
        </CollapsibleContent>

        {hasSkills && (
          <ul className="not-prose relative z-1 flex flex-wrap gap-1.5 pt-3 pl-9">
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[10px] left-3 h-px w-5 overflow-hidden bg-black/15"
            >
              <span
                data-work-experience-skill-trail-progress
                className="absolute inset-0 origin-left bg-black"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
            {skills.map((skill, index) => (
              <li key={index} className="flex">
                <Skill>{skill}</Skill>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Collapsible>
  )
}

function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "prose max-w-none prose-ncdai prose-zinc dark:prose-invert",
        className
      )}
      {...props}
    />
  )
}

function Skill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 font-navbar text-[10px] tracking-wide text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes(".")
  const endHasMonth = end ? end.includes(".") : true

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = parseInt(end, 10) - parseInt(start, 10)
    if (years <= 0) {
      return ""
    }
    return `${years}y`
  }

  const startDate = parsePeriodDate(start, "first")
  const endDate = end ? parsePeriodDate(end, "last") : new Date()

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1
  if (totalMonths <= 0) {
    return ""
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months === 0) {
    return `${years}y`
  }
  return `${years}y ${months}m`
}

function parsePeriodDate(str: string, fallbackMonth: "first" | "last"): Date {
  if (str.includes(".")) {
    return parse(str, "MM.yyyy", new Date())
  }
  return parse(
    `${fallbackMonth === "last" ? "12" : "01"}.${str}`,
    "MM.yyyy",
    new Date()
  )
}
