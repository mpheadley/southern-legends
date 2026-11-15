import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  if (!['profile', 'journal'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const dir = type === 'profile' ? 'profiles' : 'journal'
  const filePath = path.join(process.cwd(), 'content', dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  // Serve only what the site itself serves (published, not AI-written). Unpublished and
  // AI-flagged pieces 404 here exactly as their pages do (leak found 2026-11-15).
  const fm = matter(raw).data as { published?: boolean; aiWritten?: boolean; draft?: boolean }
  if (fm.published !== true || fm.aiWritten === true || fm.draft === true) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  // Strip frontmatter and MDX component tags, return clean prose
  const body = raw
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/<[A-Z][^>]*\/>/g, '')        // self-closing components
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '') // block components
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')  // MDX comments
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .trim()

  return NextResponse.json({ slug, type, body }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
