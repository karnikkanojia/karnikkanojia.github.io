import { NextResponse } from "next/server"

import { getMediumPosts } from "@/lib/medium"

export async function GET() {
  try {
    const posts = await getMediumPosts()

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Medium posts are temporarily unavailable" },
      { status: 502 }
    )
  }
}
