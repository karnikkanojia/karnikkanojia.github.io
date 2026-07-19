"use client"

import { useCallback, useEffect, useRef, type ComponentProps } from "react"
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
import { Separator } from "@/components/ui/separator"
import type { ChevronsUpDownIconHandle } from "@/components/chevrons-up-down-icon"
import { ChevronsUpDownIcon } from "@/components/chevrons-up-down-icon"
import { ArrowUpRightIcon, InfinityIcon } from "lucide-react"

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
      list.querySelectorAll<HTMLElement>("[data-work-item]")
    )
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        items.forEach((item, index) => {
          item.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              delay: index * 55,
              duration: 480,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
              fill: "both",
            }
          )
        })
        observer.disconnect()
      },
      { threshold: 0.16 }
    )

    observer.observe(list)
    return () => observer.disconnect()
  }, [experiences])

  return (
    <div
      ref={listRef}
      className={cn("text-black", className)}
    >
      {experiences.map((experience, index) => (
        <ExperienceItem
          key={experience.id}
          experience={experience}
          index={index}
        />
      ))}
    </div>
  )
}

export type ExperienceItemProps = {
  experience: ExperienceItemType
  index: number
}

export function ExperienceItem({ experience, index }: ExperienceItemProps) {
  return (
    <article
      data-work-item
      className="editorial-work-item grid py-5 transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] md:grid-cols-[3rem_minmax(12rem,0.75fr)_minmax(0,1.5fr)] md:gap-8 md:px-3 md:py-7"
    >
      <span className="mb-5 font-navbar text-[10px] leading-none font-light tracking-[0.16em] text-black/40 tabular-nums md:mb-0 md:pt-1.5">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="not-prose mb-5 flex items-start gap-3 md:mb-0">
        <div className="flex size-7 shrink-0 items-center justify-center">
          {experience.companyLogo ? (
            <Image
              src={experience.companyLogo}
              alt={experience.companyName}
              width={28}
              height={28}
              className="size-7 rounded-full border border-black/10 grayscale transition-[filter] duration-200"
            />
          ) : (
            <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          )}
        </div>

        <div className="min-w-0 pt-0.5">
          {experience.companyWebsite ? (
            <CursorFollowLabel
              className="inline-flex"
              label={`Visit ${experience.companyName}`}
            >
              <a
                className="editorial-company-link group/company inline-flex items-center gap-1.5 text-base leading-tight font-medium tracking-tight"
                href={experience.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{experience.companyName}</span>
                <ArrowUpRightIcon className="size-3.5 stroke-[1.5] transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </a>
            </CursorFollowLabel>
          ) : (
            <h3 className="text-base leading-tight font-medium tracking-tight">
              {experience.companyName}
            </h3>
          )}

          {experience.isCurrentEmployer && (
            <span className="mt-2 inline-flex items-center gap-1.5 font-navbar text-[9px] leading-none font-light tracking-[0.14em] text-black/45 uppercase">
              <span className="size-1.5 rounded-full bg-blue-600" />
              Current
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-black/10">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </article>
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

  return (
    <Collapsible
      defaultOpen={position.isExpanded}
      onOpenChange={handleOpenChange}
      disabled={!position.description}
      asChild
    >
      <div className="relative py-1 first:pt-0 last:pb-0">
        <CollapsibleTrigger
          className={cn(
            "group/experience-position not-prose block w-full text-left select-none",
            "transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]",
            "data-disabled:cursor-default data-disabled:active:scale-100"
          )}
        >
          <div className="flex items-start gap-4">
            <h4 className="flex-1 text-xl leading-[1.05] font-normal tracking-tight text-balance text-black md:text-2xl">
              {position.title}
            </h4>

            <div className="shrink-0 text-black/45 group-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
              <ChevronsUpDownIcon ref={chevronsUpDownIconRef} duration={0.15} />
            </div>
          </div>

          <dl className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-navbar text-[9px] leading-none font-light tracking-[0.12em] text-black/45 uppercase md:text-[10px]">
            {position.employmentType && (
              <>
                <div>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </div>

                <Separator
                  className="data-vertical:h-3 data-vertical:self-center data-vertical:bg-black/15"
                  orientation="vertical"
                />
              </>
            )}

            <div>
              <dt className="sr-only">Employment Period</dt>
              <dd className="flex items-center gap-1 tabular-nums">
                <span>{start}</span>
                <span>-</span>
                {isOngoing ? (
                  <InfinityIcon
                    className="size-3.5 translate-y-[0.5px] stroke-[1.5]"
                    aria-label="Present"
                  />
                ) : (
                  <span>{end}</span>
                )}
              </dd>
            </div>

            {duration && (
              <>
                <Separator
                  className="data-vertical:h-3 data-vertical:self-center data-vertical:bg-black/15"
                  orientation="vertical"
                />
                <div>
                  <dt className="sr-only">Duration</dt>
                  <dd className="tabular-nums">{duration}</dd>
                </div>
              </>
            )}
          </dl>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden">
          {position.description && (
            <Prose className="pt-4 text-sm text-black/65">
              <ReactMarkdown>{position.description}</ReactMarkdown>
            </Prose>
          )}
        </CollapsibleContent>

        {Array.isArray(position.skills) && position.skills.length > 0 && (
          <ul className="not-prose mt-4 flex flex-wrap gap-1.5">
            {position.skills.map((skill, index) => (
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
        "editorial-skill inline-flex items-center border border-black/15 px-2 py-1 font-navbar text-[9px] leading-none font-light tracking-[0.12em] text-black/55 uppercase transition-[color,border-color,transform] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]",
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
