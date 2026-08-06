import { markdownForPath } from "@/lib/markdown"

function responseFor(request: Request, includeBody: boolean) {
  const pathname = new URL(request.url).searchParams.get("path")
  const markdown = pathname ? markdownForPath(pathname) : null

  if (!markdown) {
    return new Response(null, { status: 404 })
  }

  return new Response(includeBody ? markdown : null, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "X-Markdown-Tokens": String(Math.ceil(markdown.length / 4)),
    },
  })
}

export function GET(request: Request) {
  return responseFor(request, true)
}

export function HEAD(request: Request) {
  return responseFor(request, false)
}
