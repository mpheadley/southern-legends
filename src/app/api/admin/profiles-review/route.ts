import { NextRequest, NextResponse } from "next/server";
import { getProfileBySlug, getProfileSlugs } from "@/lib/profiles";

export const dynamic = "force-dynamic";

/**
 * Read-only list of AI-written profiles (frontmatter `aiWritten: true`) for
 * /admin/profiles-review. Same PIN gate as the other admin routes
 * (x-admin-pin header vs ADMIN_PIN). GET only; nothing here writes.
 */
export async function GET(req: NextRequest) {
  const expected = process.env.ADMIN_PIN;
  const pin = req.headers.get("x-admin-pin");
  if (!expected || pin !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const profiles = getProfileSlugs()
    .map(getProfileBySlug)
    .filter((p) => p !== null && p.frontmatter.aiWritten === true)
    .map((p) => ({
      slug: p!.slug,
      title: p!.frontmatter.title ?? p!.slug,
      date: p!.frontmatter.date ?? "",
      published: p!.frontmatter.published === true,
      listed: p!.frontmatter.listed !== false,
      category: p!.frontmatter.category ?? "",
      location: p!.frontmatter.location ?? "",
      readingTime: p!.readingTime,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ ok: true, count: profiles.length, profiles });
}
