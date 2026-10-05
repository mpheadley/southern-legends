import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

type NewsItem = {
  title: string
  url: string
  desc?: string
  source: string
  date?: string
  trail_slug?: string
  category?: string
  type?: string
}

// Reads from public/data/trail-news.json (shipped with the build)
// Updated daily by nexus-trail-news.py → auto-redeploy
const STATIC_FILE = path.join(process.cwd(), "public", "data", "trail-news.json")

export async function GET(req: NextRequest) {
  const slug     = req.nextUrl.searchParams.get("slug")
  const category = req.nextUrl.searchParams.get("category")
  const limit    = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20"), 50)

  try {
    const raw   = JSON.parse(fs.readFileSync(STATIC_FILE, "utf-8"))
    let items: NewsItem[] = raw.items ?? []

    if (slug)     items = items.filter(i => !i.trail_slug || i.trail_slug === slug)
    if (category) items = items.filter(i => i.category === category)

    return NextResponse.json(
      { items: items.slice(0, limit), count: items.length, generated: raw.generated },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    )
  } catch {
    return NextResponse.json({ items: [], count: 0 })
  }
}
