export type MediumPost = {
  title: string
  publishedAt: string
  readingTimeMinutes: number
  image?: string
  imageAlt?: string
  url: string
}

const MEDIUM_PROFILE_URL = "https://medium.com/@karnikk1406120"
const MEDIUM_FEED_URL = "https://medium.com/feed/@karnikk1406120"
const ONE_HOUR = 60 * 60

function getTagValue(source: string, tagName: string) {
  const match = source.match(
    new RegExp(
      `<${tagName}\\b[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))</${tagName}>`,
      "i"
    )
  )

  return (match?.[1] ?? match?.[2] ?? "").trim()
}

function decodeHtml(value: string) {
  return value
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
}

function htmlToText(html: string) {
  return decodeHtml(
    html
      .replace(/<(?:br|\/p|\/h[1-6]|\/li|\/blockquote)>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

function getFirstImage(html: string) {
  const image = html.match(/<img\b[^>]*>/i)?.[0]
  if (!image) return undefined

  const src = image.match(/\bsrc=["']([^"']+)["']/i)?.[1]
  if (!src?.startsWith("https://")) return undefined

  return {
    url: decodeHtml(src),
    alt: decodeHtml(image.match(/\balt=["']([^"']*)["']/i)?.[1] ?? ""),
  }
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(decodeHtml(value))
    if (url.protocol !== "https:" || url.hostname !== "medium.com") return undefined

    url.search = ""
    url.hash = ""
    return url.toString()
  } catch {
    return undefined
  }
}

function toMediumPost(item: string): MediumPost | undefined {
  const title = htmlToText(getTagValue(item, "title"))
  const content = getTagValue(item, "content:encoded")
  const url = normalizeUrl(getTagValue(item, "link"))
  const publishedAt = new Date(getTagValue(item, "pubDate"))

  if (!title || !content || !url || Number.isNaN(publishedAt.valueOf())) return undefined

  const contentText = htmlToText(content)
  const words = contentText.match(/\S+/g)?.length ?? 0
  const leadImage = getFirstImage(content)

  return {
    title,
    publishedAt: publishedAt.toISOString(),
    readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    image: leadImage?.url,
    imageAlt: leadImage?.alt || undefined,
    url,
  }
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  const response = await fetch(MEDIUM_FEED_URL, {
    next: { revalidate: ONE_HOUR },
    headers: { Accept: "application/rss+xml, application/xml;q=0.9" },
  })

  if (!response.ok) {
    throw new Error(`Medium RSS feed request failed with ${response.status}`)
  }

  const xml = await response.text()
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []

  return items
    .map(toMediumPost)
    .filter((post): post is MediumPost => Boolean(post))
    .sort(
      (firstPost, secondPost) =>
        new Date(secondPost.publishedAt).valueOf() -
        new Date(firstPost.publishedAt).valueOf()
    )
    .slice(0, 4)
}

export { MEDIUM_PROFILE_URL }
