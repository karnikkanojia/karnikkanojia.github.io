"use client"

import * as React from "react"
import { animate, cubicBezier } from "animejs"
import { ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"
import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { cn } from "@/lib/utils"

interface ContributionDay {
  color: string
  contributionCount: number
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE"
  date: string
}

interface GithubContributionData {
  contributions: ContributionDay[][]
  totalContributions: number
}

interface GithubCalendarProps {
  username: string
  variant?: "default" | "city-lights" | "minimal"
  shape?: "square" | "rounded" | "circle" | "squircle"
  glowIntensity?: number
  className?: string
  showTotal?: boolean
  colorSchema?: "green" | "blue" | "purple" | "orange" | "gray"
}

// Color schemas for custom styling
const colorSchemas = {
  gray: {
    level0: "bg-zinc-100 dark:bg-zinc-900",
    level1: "bg-zinc-300 dark:bg-zinc-800",
    level2: "bg-zinc-400 dark:bg-zinc-700",
    level3: "bg-zinc-600 dark:bg-zinc-500",
    level4: "bg-zinc-800 dark:bg-zinc-300",
  },
  green: {
    level0: "bg-zinc-100 dark:bg-zinc-900",
    level1: "bg-emerald-200 dark:bg-emerald-900",
    level2: "bg-emerald-300 dark:bg-emerald-700",
    level3: "bg-emerald-400 dark:bg-emerald-500",
    level4: "bg-emerald-500 dark:bg-emerald-400",
  },
  blue: {
    level0: "bg-white",
    level1: "bg-[#c9d8f4]",
    level2: "bg-[#8cabe7]",
    level3: "bg-[#4d79d0]",
    level4: "bg-[#214a9a]",
  },
  purple: {
    level0: "bg-zinc-100 dark:bg-zinc-900",
    level1: "bg-purple-200 dark:bg-purple-900",
    level2: "bg-purple-300 dark:bg-purple-700",
    level3: "bg-purple-400 dark:bg-purple-500",
    level4: "bg-purple-500 dark:bg-purple-400",
  },
  orange: {
    level0: "bg-zinc-100 dark:bg-zinc-900",
    level1: "bg-orange-200 dark:bg-orange-900",
    level2: "bg-orange-300 dark:bg-orange-700",
    level3: "bg-orange-400 dark:bg-orange-500",
    level4: "bg-orange-500 dark:bg-orange-400",
  },
}

function getLevelClass(
  level: string,
  schema: keyof typeof colorSchemas = "green"
) {
  const s = colorSchemas[schema]
  switch (level) {
    case "FIRST_QUARTILE":
      return s.level1
    case "SECOND_QUARTILE":
      return s.level2
    case "THIRD_QUARTILE":
      return s.level3
    case "FOURTH_QUARTILE":
      return s.level4
    case "NONE":
    default:
      return s.level0
  }
}

function getShapeClass(shape: string) {
  switch (shape) {
    case "circle":
      return "rounded-full"
    case "square":
      return "rounded-none"
    case "squircle":
      return "rounded-sm" // Approximation
    case "rounded":
    default:
      return "rounded-[2px]"
  }
}

export function GithubCalendar({
  username,
  variant = "default",
  shape = "rounded",
  glowIntensity = 5,
  className,
  showTotal = true,
  colorSchema = "green",
}: GithubCalendarProps) {
  const [data, setData] = React.useState<GithubContributionData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null)
  const [hoveredCount, setHoveredCount] = React.useState<number | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/github-contributions/${encodeURIComponent(username)}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data")
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  React.useEffect(() => {
    if (!data || !gridRef.current) return

    const days = gridRef.current.querySelectorAll("[data-contribution-day]")
    animate(days, {
      opacity: [0, 1],
      translateY: [4, 0],
      delay: (_: unknown, index = 0) =>
        Math.floor(index / 7) * 10 + (index % 7) * 10,
      duration: 360,
      ease: cubicBezier(0.23, 1, 0.32, 1),
    })
  }, [data])

  if (error) {
    return (
      <div
        className={cn(
          "border border-red-300 bg-red-50 p-4 font-navbar text-[10px] tracking-wide text-red-700 uppercase",
          className
        )}
      >
        Error: {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className={cn(
          "h-40 w-full animate-pulse border border-black/10 bg-[#f1f1ee]",
          className
        )}
      />
    )
  }

  const weeks = data?.contributions || []
  const contributionDays = weeks.flat()
  const activeDays = contributionDays.filter(
    (day) => day.contributionCount > 0
  ).length
  const hoveredLabel = hoveredDate
    ? `${hoveredCount} ${hoveredCount === 1 ? "contribution" : "contributions"} . ${new Intl.DateTimeFormat(
        "en",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      ).format(new Date(`${hoveredDate}T00:00:00`))}`
    : ""

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col pt-4 pb-0 md:pt-5 md:pb-0",
        className
      )}
    >
      {showTotal && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <CursorFollowLabel
            className="inline-flex"
            icon={<ArrowUpRightIcon />}
            label="Visit GitHub"
            labelClassName="[&_svg]:!size-3.5 [&_svg]:stroke-[1.75]"
          >
            <a
              className="link inline-flex items-center gap-2"
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                height="16"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                className="fill-current text-black/45"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              <span className="font-navbar text-[10px] leading-none font-light tracking-wide text-black uppercase">
                @{username}
              </span>
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
          <span className="font-navbar text-[10px] leading-none font-light tracking-wide text-black/50 uppercase">
            {data?.totalContributions} contributions in the last year
          </span>
        </div>
      )}

      <div className="my-5 border border-black/12 bg-[#e8e8e3] p-2 sm:p-3 md:my-6">
        <CursorFollowLabel
          className="w-full"
          label={hoveredLabel}
          showLabel={hoveredDate !== null}
        >
          <div
            ref={gridRef}
            className="grid w-full auto-cols-fr grid-flow-col gap-px sm:gap-0.75"
            onMouseLeave={() => {
              setHoveredDate(null)
              setHoveredCount(null)
            }}
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex min-w-0 flex-col gap-px sm:gap-0.75"
              >
                {week.map((day) => {
                  const isGlowing =
                    variant === "city-lights" && day.contributionCount > 0
                  const isMinimal = variant === "minimal"
                  const shapeClass = getShapeClass(shape)

                  return (
                    <div
                      key={day.date}
                      data-contribution-day
                      aria-label={`${day.contributionCount} contributions on ${day.date}`}
                      onMouseEnter={() => {
                        setHoveredDate(day.date)
                        setHoveredCount(day.contributionCount)
                      }}
                      className={cn(
                        "github-contribution-day aspect-square w-full opacity-0 [box-shadow:inset_0_0_0_1px_rgb(0_0_0/0.08)] transition-[transform,background-color,box-shadow] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]",
                        getLevelClass(day.contributionLevel, colorSchema),
                        isGlowing && "z-10",
                        shapeClass,
                        isMinimal && "scale-75 rounded-full"
                      )}
                      style={
                        isGlowing
                          ? {
                              boxShadow:
                                day.contributionLevel !== "NONE"
                                  ? `0 0 ${day.contributionCount > 3 ? `${glowIntensity * 1.5}px` : `${glowIntensity}px`} ${
                                      colorSchema === "green"
                                        ? "#10b981"
                                        : colorSchema === "blue"
                                          ? "#3b82f6"
                                          : colorSchema === "purple"
                                            ? "#a855f7"
                                            : "#f97316"
                                    }`
                                  : "none",
                            }
                          : undefined
                      }
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </CursorFollowLabel>
      </div>

      <div className="flex flex-col gap-3 font-navbar text-[9px] leading-none font-light tracking-[0.12em] text-black/45 uppercase sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
        <span>
          {weeks.length} weeks . {activeDays} active days
        </span>
        <div
          className="flex items-center gap-2"
          aria-label="Contribution intensity"
        >
          <span>Less</span>
          <div className="flex gap-1">
            {[
              colorSchemas[colorSchema].level0,
              colorSchemas[colorSchema].level1,
              colorSchemas[colorSchema].level2,
              colorSchemas[colorSchema].level3,
              colorSchemas[colorSchema].level4,
            ].map((levelClass, index) => (
              <span
                key={index}
                className={cn("size-2.5 rounded-[1px]", levelClass)}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
