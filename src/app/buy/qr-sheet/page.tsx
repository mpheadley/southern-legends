import type { Metadata } from 'next'
import { MERCH } from '@/lib/merch'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const BASE = 'https://southernlegends.blog'

export default function QRSheetPage() {
  const items = MERCH.filter(m => m.available)

  return (
    <html>
      <head>
        <title>Booth QR Codes — Woodstock 5K Aug 2</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; font-family: system-ui, sans-serif; padding: 32px; }
          h1 { font-size: 18px; font-weight: 900; margin-bottom: 4px; }
          .sub { font-size: 11px; color: #666; margin-bottom: 32px; letter-spacing: 0.08em; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
          .card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; text-align: center; break-inside: avoid; }
          .card img.qr { width: 160px; height: 160px; display: block; margin: 0 auto 12px; }
          .name { font-size: 13px; font-weight: 900; margin-bottom: 4px; }
          .price { font-size: 20px; font-weight: 900; color: #E8722A; margin-bottom: 4px; }
          .url { font-size: 9px; color: #999; word-break: break-all; }
          .fundraiser { font-size: 9px; color: #166534; margin-top: 4px; }
          @media print {
            body { padding: 16px; }
            .grid { gap: 16px; }
          }
        `}</style>
      </head>
      <body>
        <h1>Woodstock 5K Booth — Scan to Buy</h1>
        <div className="sub">Aug 2, 2026 · southernlegends.org/merch · Scan any code to pay by card</div>
        <div className="grid">
          {items.map(item => {
            const url = `${BASE}/buy/${item.id}`
            const qr = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}&color=0d0d0d&bgcolor=ffffff`
            return (
              <div key={item.id} className="card">
                <img className="qr" src={qr} alt={`QR for ${item.name}`} />
                <div className="name">{item.name}</div>
                <div className="price">${item.price}</div>
                {item.fundraiser && <div className="fundraiser">25% → {item.fundraiser}</div>}
                <div className="url">{url}</div>
              </div>
            )
          })}
        </div>
      </body>
    </html>
  )
}
