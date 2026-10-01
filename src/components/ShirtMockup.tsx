'use client'

import Image from 'next/image'

export type ShirtColor = string // hex or css color

type Props = {
  src: string
  alt: string
  shirtColor?: ShirtColor
  size?: number
  className?: string
}

// Map a bg hex to which real photo blank to use
function blankForColor(hex: string): string {
  if (!hex) return '/merch/blanks/blank-cream.webp'
  const h = hex.toLowerCase().replace('#', '')
  // Black / very dark
  if (h === '0d0d0d' || h === '1a1a1a' || h === '111111' || h === '000000' || parseInt(h, 16) < 0x222222) {
    return '/merch/blanks/blank-black.webp'
  }
  // Navy
  if (h === '1e3a5f' || h === '1b2a4a' || h === '1a237e' || h.startsWith('1') && parseInt(h.slice(0,2),16) < 50) {
    return '/merch/blanks/blank-navy.webp'
  }
  // Forest / dark green
  if (h === '1c2e1a' || h === '14401a' || h === '1b3a1b') {
    return '/merch/blanks/blank-forest.webp'
  }
  // Olive / medium green
  if (h === '4a5e2a' || h === '556b2f' || h === '6b7c3e') {
    return '/merch/blanks/blank-olive.webp'
  }
  // Default cream
  return '/merch/blanks/blank-cream.webp'
}

function isDark(hex: string): boolean {
  if (!hex) return false
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export default function ShirtMockup({ src, alt, shirtColor, size = 320, className }: Props) {
  const fill = shirtColor ?? '#f5f0e8'
  const dark = isDark(fill)
  const blank = blankForColor(fill)

  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      aria-label={`${alt} shirt mockup`}
    >
      {/* Real photo blank shirt as background */}
      <Image
        src={blank}
        alt=""
        fill
        aria-hidden
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
        sizes={`${size}px`}
      />

      {/* Design composited on top with blend mode */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '22%',
        transform: 'translateX(-50%)',
        width: '52%',
        aspectRatio: '1',
        zIndex: 1,
        mixBlendMode: dark ? 'screen' : 'multiply',
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          sizes={`${Math.round(size * 0.52)}px`}
        />
      </div>
    </div>
  )
}
