import { NextResponse } from 'next/server'
import { MERCH } from '@/lib/merch'

export const runtime = 'edge'

const BASE = 'https://southernlegends.org'

const CATEGORY_LABELS: Record<string, string> = {
  shirt:    'Shirts',
  sticker:  'Stickers',
  tote:     'Totes',
  print:    'Prints',
  hat:      'Hats',
  hoodie:   'Hoodies',
  patch:    'Patches',
  pin:      'Pins',
  mug:      'Mugs',
  poster:   'Posters',
  sock:     'Socks',
}

export async function GET() {
  const available = MERCH.filter(m => m.available && m.photo)
  const all = MERCH.filter(m => m.photo)

  // Groups: fw-first, then by category
  const cats = [...new Set(all.map(m => m.category ?? 'other'))]
  const groups = [
    { key: 'fw',        label: 'On Fourthwall',   count: all.filter(m => m.photo?.includes('/merch/fw/')).length },
    { key: 'available', label: 'Available',        count: available.length },
    ...cats.map(cat => ({
      key: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      count: all.filter(m => m.category === cat).length,
    })),
  ]

  const assets = all.map(m => {
    const cat = m.category ?? 'other'
    const isFw = m.photo?.includes('/merch/fw/') ?? false
    const isPrintFile = m.photo?.includes('/print-files/') ?? false
    return {
      src:    m.photo,
      url:    BASE + m.photo,
      label:  m.name + (m.price ? ` · $${m.price}` : '') + (isFw ? ' [FW]' : isPrintFile ? ' [print]' : ''),
      group:  cat,
      dir:    isFw ? 'fw' : isPrintFile ? 'print-files' : 'merch',
      kind:   'image' as const,
      fw:     isFw,
      available: m.available ?? false,
      badge:  m.badge ?? null,
      id:     m.id,
    }
  })

  return NextResponse.json(
    { base: BASE, count: assets.length, groups, assets },
    { headers: { 'Cache-Control': 'public, s-maxage=300', 'Access-Control-Allow-Origin': '*' } }
  )
}
