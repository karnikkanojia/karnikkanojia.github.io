import { NextRequest, NextResponse } from "next/server"

import { acceptsMarkdown } from "@/lib/markdown"

export function middleware(request: NextRequest) {
  if (
    !["GET", "HEAD"].includes(request.method) ||
    !acceptsMarkdown(request.headers.get("accept"))
  ) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = "/api/markdown"
  url.search = ""
  url.searchParams.set("path", request.nextUrl.pathname)

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/", "/projects/:path*"],
}
