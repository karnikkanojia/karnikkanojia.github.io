"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react"
import { animate, createTimeline, cubicBezier, remove } from "animejs"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"
import { formatDuration } from "@/lib/format-duration"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
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
    const supportsScrollDrivenReveal =
      CSS.supports("animation-timeline: view()") &&
      CSS.supports("animation-range: 0% 100%")
    const trailTimelines = new Map<
      HTMLElement,
      ReturnType<typeof createTimeline>
    >()
    let animationFrame: number | undefined

    if (!supportsScrollDrivenReveal) {
      items.forEach((item) => {
        item.style.opacity = "0"
        item.style.transform = "translateY(24px)"
      })
    }

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

    const observer = supportsScrollDrivenReveal
      ? undefined
      : new IntersectionObserver(
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
              observer?.unobserve(item)
            })
          },
          { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
        )

    if (observer) items.forEach((item) => observer.observe(item))

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
      observer?.disconnect()
      window.removeEventListener("scroll", handleScroll)
      if (animationFrame !== undefined)
        window.cancelAnimationFrame(animationFrame)
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
        "mx-auto w-full max-w-3xl bg-background px-4 font-sans text-foreground",
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
  const currentEmployerIndicator = experience.isCurrentEmployer ? (
    <span className="relative flex shrink-0 items-center justify-center">
      <span className="absolute inline-flex size-3 animate-ping rounded-full bg-sky-500 opacity-50" />
      <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
      <span className="sr-only">Current employer</span>
    </span>
  ) : null

  return (
    <div data-work-experience-company className="space-y-4 py-4">
      <div className="not-prose flex w-full min-w-0 items-center gap-3 text-left">
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

        <h3 className="min-w-0 flex-1 text-left text-xl leading-snug font-medium">
          {experience.companyWebsite ? (
            <CursorFollowLabel
              as="span"
              className="block w-full min-w-0 text-left"
              icon={<ArrowUpRightIcon />}
              labelClassName="[&_svg]:!size-3.5 [&_svg]:stroke-[1.75]"
              label={`Visit ${experience.companyName}`}
            >
              <a
                className="flex w-full min-w-0 items-center justify-between gap-3 py-1 text-left link active:opacity-60"
                href={experience.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span className="min-w-0 truncate">
                    {experience.companyName}
                  </span>
                  {currentEmployerIndicator}
                </span>
                <Image
                  src="/noun-up-right-648092.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="block size-3 shrink-0 opacity-70"
                  aria-hidden
                />
              </a>
            </CursorFollowLabel>
          ) : (
            <span className="inline-flex items-center gap-2 text-left">
              {experience.companyName}
              {currentEmployerIndicator}
            </span>
          )}
        </h3>
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
  const [isOpen, setIsOpen] = useState(position.isExpanded ?? false)

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
  const contentId = `work-experience-${position.id}-details`

  const toggleOpen = () => {
    if (!position.description) return

    const nextOpen = !isOpen
    haptics.light()
    setIsOpen(nextOpen)
    handleOpenChange(nextOpen)
  }

  return (
    <div
      data-work-experience-position
      data-state={isOpen ? "open" : "closed"}
      className="relative"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-3 left-3 z-0 w-px overflow-hidden bg-black/15",
          hasSkills ? "bottom-2.5" : "bottom-0"
        )}
      >
        <span
          data-work-experience-trail-progress
          className="absolute inset-0 origin-top bg-black"
          style={{ transform: "scaleY(0)" }}
        />
      </span>
      <div className="relative isolate">
        <h4 className="peer/experience-position-summary not-prose relative z-1 mb-1 text-base font-medium text-balance text-foreground">
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={isOpen}
            data-state={isOpen ? "open" : "closed"}
            disabled={!position.description}
            className="experience-position-trigger group/experience-position flex w-full items-start gap-3 text-left select-none active:scale-[0.99]"
            onClick={toggleOpen}
          >
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg",
                "bg-muted text-muted-foreground",
                "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
            >
              {position.icon ?? <CodeXmlIcon />}
            </div>

            <span className="flex-1">{position.title}</span>

            <div className="shrink-0 text-muted-foreground group-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
              <ChevronsUpDownIcon
                ref={chevronsUpDownIconRef}
                duration={0.15}
                initialOpen={position.isExpanded}
              />
            </div>
          </button>
        </h4>

        {position.description && (
          <span
            data-experience-position-highlight
            aria-hidden
            className="pointer-events-none absolute -top-1 -right-2 -bottom-2 left-6 z-0 rounded-lg bg-transparent peer-focus-within/experience-position-summary:bg-[#f1f1f1]/60 peer-hover/experience-position-summary:bg-[#f1f1f1]"
          />
        )}

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
      </div>

      <div
        id={contentId}
        data-state={isOpen ? "open" : "closed"}
        hidden={!isOpen}
        className="relative z-1 overflow-hidden"
      >
        {position.description && (
          <Prose className="pt-2 pl-9 prose-p:my-1.5 prose-p:leading-[1.4] prose-ul:my-1.5 prose-li:my-1 prose-li:leading-[1.4]">
            <ReactMarkdown>{position.description}</ReactMarkdown>
          </Prose>
        )}
      </div>

      {hasSkills && (
        <ul className="not-prose relative z-1 flex flex-wrap gap-1.5 pt-3 pl-9">
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2.5 left-3 h-px w-5 overflow-hidden bg-black/15"
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
        "inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 font-navbar text-xs tracking-wide text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}
