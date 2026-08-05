import { NextResponse } from "next/server"

const contributionLevels = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const

type ContributionLevel = (typeof contributionLevels)[number]

const ONE_DAY = 60 * 60 * 24

interface ContributionDay {
  contributionCount: number
  contributionLevel: ContributionLevel
  date: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username" },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      {
        headers: {
          "User-Agent": "portfolio-github-calendar",
        },
        next: { revalidate: ONE_DAY },
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "GitHub contribution data is unavailable" },
        { status: response.status }
      )
    }

    const svg = await response.text()
    const days = [
      ...svg.matchAll(
        /<td\b(?=[^>]*\bdata-date="([^"]+)")(?=[^>]*\bdata-level="(\d+)")[^>]*>[\s\S]*?<\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/g
      ),
    ].map(([, date, level, tooltip]): ContributionDay => {
      const count = Number(
        tooltip.match(/([\d,]+) contributions?/)?.[1]?.replaceAll(",", "") ?? 0
      )

      return {
        contributionCount: count,
        contributionLevel:
          contributionLevels[Math.max(0, Math.min(4, Number(level)))],
        date,
      }
    })

    if (days.length === 0) {
      throw new Error("GitHub returned an unrecognized contribution calendar")
    }

    const weeks = new Map<string, ContributionDay[]>()
    for (const day of days) {
      const date = new Date(`${day.date}T00:00:00Z`)
      date.setUTCDate(date.getUTCDate() - date.getUTCDay())
      const weekStart = date.toISOString().slice(0, 10)
      weeks.set(weekStart, [...(weeks.get(weekStart) ?? []), day])
    }

    return NextResponse.json(
      {
        contributions: [...weeks.entries()]
          .sort(([firstWeek], [secondWeek]) =>
            firstWeek.localeCompare(secondWeek)
          )
          .map(([, week]) =>
            week.sort((firstDay, secondDay) =>
              firstDay.date.localeCompare(secondDay.date)
            )
          ),
        totalContributions: days.reduce(
          (total, day) => total + day.contributionCount,
          0
        ),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve GitHub contribution data" },
      { status: 502 }
    )
  }
}
