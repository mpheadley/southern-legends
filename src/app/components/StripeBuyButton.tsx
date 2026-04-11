'use client'

import React from 'react'
import Script from 'next/script'

export default function StripeBuyButton() {
  const buttonId = process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!buttonId || !publishableKey) return null

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
      />
      {React.createElement('stripe-buy-button', {
        'buy-button-id': buttonId,
        'publishable-key': publishableKey,
      })}
    </>
  )
}
