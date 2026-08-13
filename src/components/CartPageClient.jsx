'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductOptionsDialog from './ProductOptionsDialog.jsx'
import {
  CART_CHANGED_EVENT,
  getStoredCart,
  removeCartItem,
  replaceCartItem,
  saveOrderDraft,
  updateCartItemQuantity,
} from '../lib/cart.js'
import { createOrderItem } from '../lib/product-options.js'
import { getProductImageAlt } from '../lib/product-seo.js'
import { ROUTES } from '../lib/routes.js'
import { ASSETS } from '../lib/site.js'

const CartPageClient = ({ products }) => {
  const [items, setItems] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    const syncCart = () => {
      const cartItems = getStoredCart()

      setItems(cartItems)
      setSelectedKeys((currentKeys) => {
        const availableKeys = new Set(cartItems.map((item) => item.key))

        return currentKeys.filter((key) => availableKeys.has(key))
      })
    }

    syncCart()
    window.addEventListener(CART_CHANGED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  const editingProduct = editingItem ? products.find((product) => product.slug === editingItem.productSlug) : null
  const selectedItems = items.filter((item) => selectedKeys.includes(item.key))
  const allSelected = items.length > 0 && selectedKeys.length === items.length

  const handleToggleItem = (itemKey) => {
    setSelectedKeys((currentKeys) => (currentKeys.includes(itemKey) ? currentKeys.filter((key) => key !== itemKey) : [...currentKeys, itemKey]))
  }

  const handleToggleAll = () => {
    setSelectedKeys(allSelected ? [] : items.map((item) => item.key))
  }

  const handleQuantityChange = (itemKey, quantity) => {
    setItems(updateCartItemQuantity(itemKey, quantity))
  }

  const handleRemove = (itemKey) => {
    setItems(removeCartItem(itemKey))
    setSelectedKeys((currentKeys) => currentKeys.filter((key) => key !== itemKey))
  }

  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) return

    saveOrderDraft({
      source: 'cart',
      items: selectedItems,
    })
    window.location.href = ROUTES.orderConfirmation
  }

  const handleEditContinue = ({ variant, size, quantity }) => {
    if (!editingProduct || !editingItem) return

    const nextItems = replaceCartItem(
      editingItem.key,
      createOrderItem({
        product: editingProduct,
        category: editingProduct.category || editingItem.category,
        productPath: editingItem.productUrl || ROUTES.collectionProduct(editingProduct.category, editingProduct.slug),
        variant,
        size,
        quantity,
        fallbackImage: editingItem.image || ASSETS.heroBgWebp,
      }),
    )

    setItems(nextItems)
    setSelectedKeys((currentKeys) => {
      const nextKeys = new Set(nextItems.map((item) => item.key))
      const nextEditedKey = nextItems.find((item) => item.productSlug === editingProduct.slug && item.size === size && item.variantCode === (variant.code || variant.name))?.key
      const filteredKeys = currentKeys.filter((key) => nextKeys.has(key))

      return nextEditedKey && currentKeys.includes(editingItem.key) ? [...new Set([...filteredKeys, nextEditedKey])] : filteredKeys
    })
    setEditingItem(null)
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link href={ROUTES.collections} className="mb-6 inline-block text-blue-600 hover:underline">
          &larr; Back to Collections
        </Link>

        <div className="mb-10 mt-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="mt-3 text-gray-600">Select the products you want to order now.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center text-gray-600">
            <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
            <p className="mt-2">Explore our collections and add something you like.</p>
            <Link href={ROUTES.collections} className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-white">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="h-5 w-5 accent-black"
                  />
                  Select All
                </label>
                <p className="text-sm font-medium text-gray-600">{selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected</p>
              </div>

              {items.map((item) => {
                const selected = selectedKeys.includes(item.key)

                return (
                  <article key={item.key} className="grid grid-cols-[24px_88px_1fr] gap-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="pt-8">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleToggleItem(item.key)}
                        className="h-5 w-5 accent-black"
                        aria-label={`Select ${item.productName}`}
                        title={`Select ${item.productName}`}
                      />
                    </label>
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={getProductImageAlt({ productName: item.productName, variantName: item.variantName, context: `cart item size ${item.size || '-'}` })}
                          fill
                          sizes="88px"
                          className="object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-semibold text-gray-900">{item.productName}</h2>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.variantName || '-'} · Size {item.size || '-'}
                          </p>
                        </div>
                        <button type="button" onClick={() => handleRemove(item.key)} className="text-sm font-semibold text-gray-500 hover:text-red-600" aria-label={`Remove ${item.productName} ${item.variantName || ''} size ${item.size || ''} from cart`} title={`Remove ${item.productName} from cart`}>
                          Remove
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                          Quantity
                          <span className="flex items-center rounded-xl border border-gray-300 bg-white">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.key, Math.max(1, item.quantity - 1))}
                              className="h-10 px-3 text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                              aria-label="Decrease quantity"
                              title="Decrease quantity"
                            >
                              -
                            </button>
                            <output className="flex h-10 w-10 items-center justify-center border-x border-gray-200 text-sm font-bold">
                              {item.quantity}
                            </output>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.key, Math.min(99, item.quantity + 1))}
                              className="h-10 px-3 text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                              aria-label="Increase quantity"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </span>
                        </div>
                        <button type="button" onClick={() => setEditingItem(item)} className="text-sm font-semibold text-gray-500 underline hover:text-black" aria-label={`Edit ${item.productName} ${item.variantName || ''} size ${item.size || ''}`} title={`Edit ${item.productName}`}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Cart Summary</h2>
              <p className="mt-2 text-sm text-gray-600">{selectedItems.length} selected from {items.length} cart item{items.length === 1 ? '' : 's'}.</p>
              <button
                type="button"
                onClick={handleCheckoutSelected}
                disabled={selectedItems.length === 0}
                aria-label={`Checkout selected cart items, ${selectedItems.length} selected`}
                title={`Checkout selected cart items (${selectedItems.length})`}
                className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] !text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:!text-gray-500"
              >
                Checkout Selected ({selectedItems.length})
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">You will review shipping details before WhatsApp.</p>
            </aside>
          </div>
        )}

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

export default CartPageClient
