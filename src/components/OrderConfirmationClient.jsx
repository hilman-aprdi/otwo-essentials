'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductOptionsDialog from './ProductOptionsDialog.jsx'
import {
  ORDER_DRAFT_CHANGED_EVENT,
  createWhatsAppOrderUrl,
  getStoredCart,
  getStoredOrderDraft,
  replaceCartItem,
  saveOrderDraft,
} from '../lib/cart.js'
import { createOrderItem } from '../lib/product-options.js'
import { getProductImageAlt } from '../lib/product-seo.js'
import { ROUTES } from '../lib/routes.js'
import { ASSETS } from '../lib/site.js'

const initialCustomer = {
  name: '',
  phone: '',
  address: '',
  notes: '',
}

const initialErrors = {
  name: '',
  phone: '',
  address: '',
}

const validateCustomer = (customer) => {
  const errors = { ...initialErrors }
  const phonePattern = /^[+()\d\s-]{7,20}$/

  if (!customer.name.trim()) errors.name = 'Please enter your name.'
  if (!customer.phone.trim()) errors.phone = 'Please enter your WhatsApp number.'
  else if (!phonePattern.test(customer.phone.trim())) errors.phone = 'Please enter a valid WhatsApp number.'
  if (!customer.address.trim()) errors.address = 'Please enter your shipping address.'

  return errors
}

const hasErrors = (errors) => Object.values(errors).some(Boolean)

const OrderConfirmationClient = ({ products }) => {
  const [orderDraft, setOrderDraft] = useState(null)
  const [hasCartItems, setHasCartItems] = useState(false)
  const [customer, setCustomer] = useState(initialCustomer)
  const [errors, setErrors] = useState(initialErrors)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    const syncDraft = () => {
      setOrderDraft(getStoredOrderDraft())
      setHasCartItems(getStoredCart().length > 0)
    }

    syncDraft()
    window.addEventListener(ORDER_DRAFT_CHANGED_EVENT, syncDraft)
    window.addEventListener('storage', syncDraft)

    return () => {
      window.removeEventListener(ORDER_DRAFT_CHANGED_EVENT, syncDraft)
      window.removeEventListener('storage', syncDraft)
    }
  }, [])

  const items = orderDraft?.items || []
  const editingProduct = editingItem ? products.find((product) => product.slug === editingItem.productSlug) : null

  const handleCustomerChange = (field, value) => {
    setCustomer((currentCustomer) => ({ ...currentCustomer, [field]: value }))
    if (errors[field]) setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleWhatsAppContinue = (event) => {
    event.preventDefault()
    const nextErrors = validateCustomer(customer)

    setErrors(nextErrors)
    if (hasErrors(nextErrors) || items.length === 0) return

    window.location.href = createWhatsAppOrderUrl({ items, customer })
  }

  const handleEditContinue = ({ variant, size, quantity }) => {
    if (!editingProduct || !editingItem || !orderDraft) return

    const nextItem = createOrderItem({
      product: editingProduct,
      category: editingProduct.category || editingItem.category,
      productPath: editingItem.productUrl || ROUTES.collectionProduct(editingProduct.category, editingProduct.slug),
      variant,
      size,
      quantity,
      fallbackImage: editingItem.image || ASSETS.heroBgWebp,
    })
    const nextItems = orderDraft.items.map((item) => (item.key === editingItem.key ? { ...nextItem, key: editingItem.key } : item))
    const nextDraft = {
      ...orderDraft,
      items: nextItems,
    }

    saveOrderDraft(nextDraft)
    setOrderDraft(nextDraft)
    if (orderDraft.source === 'cart') replaceCartItem(editingItem.key, nextItem)
    setEditingItem(null)
  }

  if (!orderDraft || items.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mt-16 rounded-2xl bg-white px-6 py-12 text-center text-gray-600">
            <p className="text-lg font-semibold text-gray-900">No items selected for order.</p>
            <p className="mt-2">Choose a product or select items from your cart before continuing.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={ROUTES.collections} className="inline-flex justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-white">
                Explore Collections
              </Link>
              {hasCartItems && (
                <Link href={ROUTES.cart} className="inline-flex justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-black">
                  View Cart
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link href={orderDraft.source === 'cart' ? ROUTES.cart : ROUTES.collections} className="mb-6 inline-block text-blue-600 hover:underline">
          &larr; {orderDraft.source === 'cart' ? 'Back to Cart' : 'Back to Collections'}
        </Link>

        <div className="mb-10 mt-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Order</h1>
          <p className="mt-3 text-gray-600">Check your order details before continuing to WhatsApp.</p>
        </div>

        <form className="grid gap-8 lg:grid-cols-[1.15fr_1fr]" onSubmit={handleWhatsAppContinue} noValidate>
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-900">Your Order</h2>
            {items.map((item, index) => (
              <article key={item.key || `${item.productSlug}-${index}`} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="grid grid-cols-[96px_1fr] gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={getProductImageAlt({ productName: item.productName, variantName: item.variantName, context: `order review size ${item.size || '-'}` })}
                        fill
                        sizes="96px"
                        className="object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.variantName || '-'} · Size {item.size || '-'}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">Qty {item.quantity}</p>
                      <button type="button" onClick={() => setEditingItem(item)} className="text-sm font-semibold text-gray-500 underline hover:text-black" aria-label={`Edit ${item.productName} ${item.variantName || ''} size ${item.size || ''}`} title={`Edit ${item.productName}`}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Contact & Shipping Details</h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll use these details to prepare your order. Stock, shipping cost, and payment will be confirmed via WhatsApp.
            </p>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                Name *
                <input
                  type="text"
                  value={customer.name}
                  onChange={(event) => handleCustomerChange('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your name"
                />
                {errors.name && <span id="name-error" className="mt-1 block text-xs font-medium text-red-600">{errors.name}</span>}
              </label>
              <label className="block text-sm font-semibold text-gray-900">
                WhatsApp Number *
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(event) => handleCustomerChange('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && <span id="phone-error" className="mt-1 block text-xs font-medium text-red-600">{errors.phone}</span>}
              </label>
              <label className="block text-sm font-semibold text-gray-900">
                Shipping Address *
                <textarea
                  value={customer.address}
                  onChange={(event) => handleCustomerChange('address', event.target.value)}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Full address for shipping"
                />
                {errors.address && <span id="address-error" className="mt-1 block text-xs font-medium text-red-600">{errors.address}</span>}
              </label>
              <label className="block text-sm font-semibold text-gray-900">
                Notes
                <textarea
                  value={customer.notes}
                  onChange={(event) => handleCustomerChange('notes', event.target.value)}
                  className="mt-2 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Optional notes"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] !text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label="Continue to WhatsApp with this order"
              title="Continue to WhatsApp"
            >
              Continue to WhatsApp
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">No payment is collected on this website.</p>
          </div>
        </form>

        {editingProduct && (
          <ProductOptionsDialog
            open={Boolean(editingItem)}
            product={editingProduct}
            mode="edit"
            initialSelection={editingItem}
            fallbackImage={editingItem.image || ASSETS.heroBgWebp}
            title="Edit your selection"
            onClose={() => setEditingItem(null)}
            onContinue={handleEditContinue}
          />
        )}
      </div>
    </section>
  )
}

export default OrderConfirmationClient
