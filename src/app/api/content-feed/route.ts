import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

interface ContentItem {
  slug: string
  type: 'profile' | 'journal'
  title: string
  excerpt: string
  date: string
  published: boolean
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const result: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    result[key] = value
  }
  return result
}

function readContentDir(dir: string, type: 'profile' | 'journal'): ContentItem[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const fm = parseFrontmatter(raw)
      return {
        slug,
        type,
        title: fm.title ?? fm.name ?? slug,
        excerpt: fm.excerpt ?? '',
        date: fm.date ?? '',
        // Same rule as the pages: published, not AI-written, not draft.
        published: fm.published === 'true' && fm.aiWritten !== 'true' && fm.draft !== 'true',
      }
    })
    .filter(item => item.published)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function GET() {
  const base = path.join(process.cwd(), 'content')
  const profiles = readContentDir(path.join(base, 'profiles'), 'profile')
  const journal = readContentDir(path.join(base, 'journal'), 'journal')
  return NextResponse.json([...profiles, ...journal], {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
