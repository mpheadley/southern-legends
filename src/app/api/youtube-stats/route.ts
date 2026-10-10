import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600 // 1-hour edge cache

interface VideoStats {
  videoId: string
  title: string
  viewCount: string
  likeCount: string
  publishedAt: string
}

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId')
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: 'Invalid videoId' }, { status: 400 })
  }

  // Fail soft (audit C-11): stats are decoration. With no key or an upstream error,
  // answer 200 + null so the embed renders without stats and the console stays clean.
  const none = () => NextResponse.json(null, { headers: { 'Cache-Control': 'public, s-maxage=3600' } })

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return none()

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
  let res: Response
  try {
    res = await fetch(url, { next: { revalidate: 3600 } })
  } catch {
    return none()
  }

  if (!res.ok) return none()

  const data = await res.json() as {
    items?: Array<{
      id: string
      snippet: { title: string; publishedAt: string }
      statistics: { viewCount?: string; likeCount?: string }
    }>
  }

  const item = data.items?.[0]
  if (!item) return none()

  const stats: VideoStats = {
    videoId: item.id,
    title: item.snippet.title,
    viewCount: item.statistics.viewCount ?? '0',
    likeCount: item.statistics.likeCount ?? '0',
    publishedAt: item.snippet.publishedAt,
  }

  return NextResponse.json(stats)
}
