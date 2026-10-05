'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ShirtMockup from '@/components/ShirtMockup'

/**
 * Woodstock 5K race-day merch grid.
 * Shirts render via ShirtMockup (design on blank shirt, real shirt color on hover)
 * per the buyer-facing merch rule. Stickers/prints render as plain images.
 *
 * TO SWAP IN A REAL PRODUCT PHOTO: set `realPhoto` on the item — the card will
 * show the photo instead of the mockup. That's the only change needed.
 */

type Kind = 'shirt' | 'sticker' | 'print' | 'coming'

type Item = {
  id: string
  name: string
  tagline: string
  price?: number
  /** raw design graphic for ShirtMockup, or the product image for stickers/prints */
  src?: string
  /** shirt color revealed on hover */
  shirtColor?: string
  /** if set, show this real product photo instead of the mockup */
  realPhoto?: string
  badge?: string
  kind: Kind
}

const ITEMS: Item[] = [
  {
    id: 'woodstock-oval',
    name: 'Woodstock Avenue Oval',
    tagline: 'Cream tee · RRCA State Championship',
    price: 35,
    src: '/print-files/WOODSTOCK-00-woodstock-avenue-oval-CREAM.png',
    shirtColor: '#f5f0e8',
    badge: 'Race day',
    kind: 'shirt',
  },
  {
    id: 'survived-woodstock',
    name: 'I Survived Woodstock Avenue',
    tagline: 'Black tee · 45 years running',
    price: 30,
    src: '/print-files/WOODSTOCK-01-survived-woodstock-BLACK.png',
    shirtColor: '#141414',
    badge: 'Race day',
    kind: 'shirt',
  },
  {
    id: 'anniston-45',
    name: 'Anniston 45',
    tagline: 'Navy tee · 45 years of running',
    price: 35,
    src: '/print-files/SL-03-anniston-45-NAVY.png',
    shirtColor: '#1e3a5f',
    badge: 'Local pride',
    kind: 'shirt',
  },
  {
    id: 'clt-shirt',
    name: "Ladiga's Land",
    tagline: 'Chief Ladiga Trail · 33.5 miles',
    price: 35,
    realPhoto: '/merch/fw/chief-ladiga-trail-01.webp',
    src: '/merch/fw/chief-ladiga-trail-01.webp',
    shirtColor: '#f5f0e8',
    kind: 'shirt',
  },
  {
    id: 'woodstock-sticker',
    name: 'Woodstock 5K Sticker',
    tagline: '3" vinyl · at the booth',
    price: 5,
    src: '/merch/woodstock-badge.png',
    badge: 'At booth',
    kind: 'sticker',
  },
  {
    id: 'clt-sticker',
    name: 'Chief Ladiga Trail Sticker',
    tagline: '3" round · weather-resistant',
    price: 5,
    src: '/merch/clt-sticker-print.png',
    kind: 'sticker',
  },
  {
    id: 'clt-map',
    name: 'CLT Trail Map Print',
    tagline: '18×24 · full trail · ships in a tube',
    price: 15,
    src: '/merch/clt-trail-map-print.webp',
    kind: 'print',
  },
  {
    id: 'coin-keychain',
    name: 'Woodstock Coin Keychain',
    tagline: 'Printable coin · minted in Anniston',
    kind: 'coming',
  },
]

function ShirtCard({ item }: { item: Item }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="rounded-2xl border border-black/10 bg-[#f5f0e8] p-4 flex flex-col items-center text-center transition-shadow hover:shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {item.realPhoto ? (
        <div className="relative w-[220px] h-[253px]">
          <Image src={item.realPhoto} alt={item.name} fill className="object-contain" sizes="220px" />
        </div>
      ) : (
        <ShirtMockup src={item.src!} alt={item.name} shirtColor={hover ? item.shirtColor : undefined} size={220} />
      )}
      <h3 className="mt-3 font-serif text-lg text-neutral-900">{item.name}</h3>
      <p className="text-sm text-neutral-600">{item.tagline}</p>
      {item.price != null && <p className="mt-1 font-semibold text-neutral-900">${item.price}</p>}
    </div>
  )
}

function FlatCard({ item }: { item: Item }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
      <div className="relative w-[200px] h-[200px]">
        <Image src={item.src!} alt={item.name} fill className="object-contain" sizes="200px" />
      </div>
      <h3 className="mt-3 font-serif text-lg text-neutral-900">{item.name}</h3>
      <p className="text-sm text-neutral-600">{item.tagline}</p>
      {item.price != null && <p className="mt-1 font-semibold text-neutral-900">${item.price}</p>}
    </div>
  )
}

function ComingCard({ item }: { item: Item }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#CA8A04]/60 bg-[#faf7f2] p-4 flex flex-col items-center justify-center text-center min-h-[300px]">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth={1.5} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5.5" opacity="0.5" />
        <path d="M12 8.5v7M9.5 10.5h5M9.5 13.5h5" opacity="0.6" />
      </svg>
      <span className="mt-3 inline-block rounded-full bg-[#CA8A04]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a5a04]">
        Coming soon
      </span>
      <h3 className="mt-3 font-serif text-lg text-neutral-900">{item.name}</h3>
      <p className="text-sm text-neutral-600">{item.tagline}</p>
    </div>
  )
}

export default function WoodstockMerch() {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ITEMS.map((item) =>
          item.kind === 'shirt' ? (
            <ShirtCard key={item.id} item={item} />
          ) : item.kind === 'coming' ? (
            <ComingCard key={item.id} item={item} />
          ) : (
            <FlatCard key={item.id} item={item} />
          )
        )}
      </div>
      <p className="mt-4 text-center text-sm text-neutral-500">
        More stickers, tees, and the coin keychain landing soon.{' '}
        <Link href="/merch" className="underline">See the full Southern Legends store →</Link>
      </p>
    </div>
  )
}
