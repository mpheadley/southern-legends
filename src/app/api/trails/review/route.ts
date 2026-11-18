import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { junkReason } from "@/lib/junk"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trail_slug, name, rating, title, body: reviewBody, date_hiked, conditions, difficulty_felt } = body

    if (!trail_slug || !name || !rating || !reviewBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (junkReason({ name, message: reviewBody, date: date_hiked })) {
      return NextResponse.json({ success: true })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 })
    }
    if (reviewBody.length < 20) {
      return NextResponse.json({ error: "Review too short" }, { status: 400 })
    }

    const { error } = await supabase.from("trail_reviews").insert({
      trail_slug,
      name: name.trim().substring(0, 80),
      rating,
      title: title?.trim().substring(0, 100) ?? null,
      body: reviewBody.trim().substring(0, 2000),
      date_hiked: date_hiked ?? null,
      conditions: conditions ?? null,
      difficulty_felt: difficulty_felt ?? null,
      approved: false,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Trail review error:", err)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const { data, error } = await supabase
    .from("trail_reviews")
    .select("id, name, rating, title, body, date_hiked, conditions, difficulty_felt, created_at")
    .eq("trail_slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 })

  const avg = data?.length
    ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
    : null

  return NextResponse.json({ reviews: data ?? [], average: avg, count: data?.length ?? 0 })
}
