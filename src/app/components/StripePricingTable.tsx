'use client'

import React from 'react'
import Script from 'next/script'

export default function StripePricingTable() {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="lazyOnload"
      />
      {React.createElement('stripe-pricing-table', {
        'pricing-table-id': 'prctbl_1TMAbEJgNKbWb28hw4ypZs1o',
        'publishable-key':
          'pk_live_51T5YjIJgNKbWb28heNwQ7izTnsyxwrN6CjGFTVc430VOt52gJeolQfCr4CZ6M00v9S8R3Vl0xp8rEvAWOEHjVDaS00ucDrsVdZ',
      })}
    </>
  )
}
