'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { getSizeOptions, getVariants } from '../lib/product-options.js'
import { getProductImageAlt } from '../lib/product-seo.js'

const getInitialVariantIndex = (variants, initialSelection) => {
  const selectedIndex = variants.findIndex((variant) => variant.code === initialSelection?.variantCode || variant.name === initialSelection?.variantName)

  if (selectedIndex >= 0) return selectedIndex

  const inStockIndex = variants.findIndex((variant) => variant.inStock !== false)

  return inStockIndex >= 0 ? inStockIndex : 0
}

const ProductOptionsDialog = ({
  open,
  product,
  mode = 'buy-now',
  initialSelection,
  fallbackImage,
  title = 'Complete your selection',
  onClose,
  onContinue,
}) => {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const variants = getVariants(product)
  const sizeOptions = getSizeOptions(product)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const selectedVariant = variants[selectedVariantIndex] || {}
  const previewImage = selectedVariant.frontImage || fallbackImage
  const canContinue = Boolean(selectedVariant.name && selectedVariant.inStock !== false && selectedSize)
  const actionLabel = mode === 'add-to-cart' ? 'Add to Cart' : mode === 'edit' ? 'Update Item' : 'Continue Order'

  useEffect(() => {
    if (!open) return

    setSelectedVariantIndex(getInitialVariantIndex(variants, initialSelection))
    setSelectedSize(initialSelection?.size || '')
    setQuantity(Math.max(1, Math.min(99, Number.parseInt(initialSelection?.quantity, 10) || 1)))
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [initialSelection, onClose, open, variants])

  if (!open) return null

  const handleContinue = () => {
    if (!canContinue) return

    onContinue({
      variant: selectedVariant,
      size: selectedSize,
      quantity,
    })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 px-0 sm:items-center sm:px-4" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-options-title"
        className="max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl outline-none transition-transform sm:max-w-lg sm:rounded-3xl sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300 sm:hidden" aria-hidden="true" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {mode === 'add-to-cart' ? 'Add to Cart' : mode === 'edit' ? 'Edit Item' : 'Buy Now'}
            </p>
            <h2 id="product-options-title" className="mt-1 text-2xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Close product options"
            title="Close product options"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-[80px_1fr] gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
            {previewImage && (
              <Image
                src={previewImage}
                alt={getProductImageAlt({ productName: product.name, variantName: selectedVariant.name, angle: 'front', context: 'order selection preview' })}
                fill
                sizes="80px"
                className="object-contain"
                loading="lazy"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{[product.category, product.type].filter(Boolean).join(' / ')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-900">Color</legend>
            <div className="grid grid-cols-3 gap-2">
              {variants.map((variant, index) => {
                const selected = selectedVariantIndex === index

                return (
                  <button
                    key={variant.code || `${variant.name}-${index}`}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                    disabled={variant.inStock === false}
                    aria-label={`Select ${variant.name} color${variant.inStock === false ? ', sold out' : ''}`}
                    aria-pressed={selected}
                    title={`Select ${variant.name} color${variant.inStock === false ? ' (sold out)' : ''}`}
                    className={`relative flex min-h-24 flex-col items-center justify-center rounded-xl border p-2 text-center transition-all focus:outline-none focus:ring-2 focus:ring-black ${
                      selected ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-black'
                    } ${variant.inStock === false ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black" aria-hidden="true">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {variant.frontImage && (
                      <span className="relative mb-2 block h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={variant.frontImage}
                          alt={getProductImageAlt({ productName: product.name, variantName: variant.name, angle: 'front', context: 'color option' })}
                          fill
                          sizes="48px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </span>
                    )}
                    <span className="text-xs font-semibold">{variant.name}</span>
                    {variant.inStock === false && <span className="mt-1 text-[10px] uppercase">Sold out</span>}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <div className="mb-3 flex items-center justify-between gap-3">
              <legend className="text-xs font-bold uppercase tracking-[0.16em] text-gray-900">Size</legend>
              <span className="text-xs font-semibold text-gray-500">See Size Guide above</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map((size) => {
                const selected = selectedSize === size

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select size ${size}`}
                    aria-pressed={selected}
                    title={`Select size ${size}`}
                    className={`min-h-12 rounded-xl border text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-black ${
                      selected ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-900">Quantity</div>
            <div className="flex w-40 items-center rounded-xl border border-gray-300 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
                className="h-12 flex-1 text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Decrease quantity"
                title="Decrease quantity"
              >
                -
              </button>
              <output className="flex h-12 w-12 items-center justify-center border-x border-gray-200 text-sm font-bold text-gray-900" aria-live="polite">
                {quantity}
              </output>
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.min(99, currentQuantity + 1))}
                className="h-12 flex-1 text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Increase quantity"
                title="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-5 mt-7 border-t border-gray-200 bg-white px-5 pb-1 pt-4 sm:static sm:-mx-0 sm:border-t-0 sm:px-0 sm:pb-0">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] !text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:!text-gray-500"
          >
            {selectedSize ? actionLabel : 'Select a Size to Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductOptionsDialog
