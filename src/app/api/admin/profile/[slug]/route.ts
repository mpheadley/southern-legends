import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dir = path.join(process.cwd(), "content/profiles");

function auth(req: NextRequest) {
  return req.headers.get("x-admin-pin") === process.env.ADMIN_PIN;
}

// Only slugs that map to an existing .mdx file — no traversal.
function fileFor(slug: string): string | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const fp = path.join(dir, `${slug}.mdx`);
  if (path.dirname(fp) !== dir) return null;
  return fp;
}

// GET → full frontmatter + body + derived stats
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!auth(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const fp = fileFor(slug);
  if (!fp || !fs.existsSync(fp)) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const raw = fs.readFileSync(fp, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return NextResponse.json({
    ok: true,
    slug,
    frontmatter: data,
    content,
    words: stats.words,
    readTime: stats.text,
  });
}

// POST → write frontmatter + body back to disk
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!auth(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const fp = fileFor(slug);
  if (!fp || !fs.existsSync(fp)) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== "string" || typeof body.frontmatter !== "object") {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  const fm = { ...body.frontmatter, lastModified: new Date().toISOString().slice(0, 10) };
  const out = matter.stringify(body.content, fm);
  fs.writeFileSync(fp, out, "utf-8");

  const stats = readingTime(body.content);
  return NextResponse.json({ ok: true, slug, words: stats.words, readTime: stats.text });
}
