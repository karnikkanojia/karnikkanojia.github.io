import { differenceInMonths, parse } from "date-fns"

type PeriodFallbackMonth = "first" | "last"

export function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes(".")
  const endHasMonth = end ? end.includes(".") : true

  if (!startHasMonth && end && !endHasMonth) {
    const years = Number.parseInt(end, 10) - Number.parseInt(start, 10)
    return years > 0 ? `${years}y` : ""
  }

  const startDate = parsePeriodDate(start, "first")
  const endDate = end ? parsePeriodDate(end, "last") : new Date()
  const totalMonths = differenceInMonths(endDate, startDate) + 1

  if (totalMonths <= 0) return ""
  if (totalMonths < 12) return `${totalMonths}m`

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return months === 0 ? `${years}y` : `${years}y ${months}m`
}

function parsePeriodDate(
  value: string,
  fallbackMonth: PeriodFallbackMonth
): Date {
  const normalizedValue = value.includes(".")
    ? value
    : `${fallbackMonth === "last" ? "12" : "01"}.${value}`

  return parse(normalizedValue, "MM.yyyy", new Date())
}
