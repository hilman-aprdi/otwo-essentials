'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CART_CHANGED_EVENT, getCartLineItemCount, getStoredCart } from '../lib/cart.js'
import { ROUTES } from '../lib/routes.js'

const CartButton = ({ className = '' }) => {
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    const syncCartQuantity = () => setQuantity(getCartLineItemCount(getStoredCart()))

    syncCartQuantity()
    window.addEventListener(CART_CHANGED_EVENT, syncCartQuantity)
    window.addEventListener('storage', syncCartQuantity)

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, syncCartQuantity)
      window.removeEventListener('storage', syncCartQuantity)
    }
  }, [])

  return (
    <Link
      href={ROUTES.cart}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-transparent text-white transition-all hover:border-white hover:bg-white/10 ${className}`}
      aria-label={`Shopping cart${quantity ? `, ${quantity} item${quantity > 1 ? 's' : ''}` : ''}`}
      title={`Shopping cart${quantity ? ` (${quantity})` : ''}`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12L6 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6 5.2 3H3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 20.5h.01M17.5 20.5h.01" />
      </svg>
      {quantity > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
          {quantity > 99 ? '99+' : quantity}
        </span>
      )}
    </Link>
  )
}

export default CartButton
