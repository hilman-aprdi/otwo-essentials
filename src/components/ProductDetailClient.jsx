'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductOptionsDialog from './ProductOptionsDialog.jsx'
import { addCartItem, saveOrderDraft } from '../lib/cart.js'
import { createOrderItem, getSizeReferenceImage, getSizeTable, getVariants } from '../lib/product-options.js'
import { getProductImageAlt } from '../lib/product-seo.js'
import { ROUTES } from '../lib/routes.js'
import { ASSETS, SITE_NAME } from '../lib/site.js'

const productUtils = {
  getVariants,
}

const ProductDetailClient = ({ product, category, images, productPath }) => {
  const [imgIdx, setImgIdx] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const imgContainerRef = useRef(null)
  const [tab, setTab] = useState('DETAILS')
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [showOptions, setShowOptions] = useState(false)
  const [purchaseMode, setPurchaseMode] = useState('buy-now')
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    if (!showLightbox) {
      setZoom(false)
      setOffset({ x: 0, y: 0 })
    }
  }, [showLightbox, imgIdx])

  const variants = productUtils.getVariants(product)
  const sizeTable = getSizeTable(product)
  const sizeReferenceImage = getSizeReferenceImage(product)
  const detailsList = [
    { label: 'Material', value: product.material || '-' },
    { label: 'Description', value: product.description || '-' },
  ]

  const handleColorClick = (colorIndex) => {
    setSelectedVariantIndex(colorIndex)
    let targetImgIdx = 0
    for (let i = 0; i < variants.length; i += 1) {
      if (i === colorIndex) break
      if (variants[i].frontImage) targetImgIdx += 1
      if (variants[i].backImage) targetImgIdx += 1
    }
    if (variants[colorIndex].frontImage) {
      setImgIdx(targetImgIdx)
    }
  }

  const openOptions = (mode) => {
    setPurchaseMode(mode)
    setCartMessage('')
    setShowOptions(true)
  }

  const handleProductOptionsContinue = ({ variant, size, quantity }) => {
    const orderItem = createOrderItem({
      product,
      category,
      productPath,
      variant,
      size,
      quantity,
      fallbackImage: images[0]?.src || ASSETS.heroBgWebp,
    })

    if (purchaseMode === 'add-to-cart') {
      addCartItem(orderItem)
      setCartMessage('Added to cart.')
      setShowOptions(false)
      return
    }

    saveOrderDraft({
      source: 'buy-now',
      items: [orderItem],
    })
    window.location.href = ROUTES.orderConfirmation
  }

  return (
    <>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href={ROUTES.collections} className="mb-6 inline-block text-blue-600 hover:underline">
            &larr; Back to Collections
          </Link>
          <div className="flex flex-col items-start gap-8 rounded-lg bg-white p-4 md:flex-row md:gap-12 md:p-8">
            <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-start">
              <div className="relative aspect-square w-full max-w-none overflow-hidden rounded bg-gray-100">
                {images.length > 1 && (
                  <button
                    onClick={() => setImgIdx((idx) => (idx - 1 + images.length) % images.length)}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-gray-100"
                    aria-label="Show previous product image"
                    title="Show previous product image"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {images[imgIdx] && (
                  <Image
                    src={images[imgIdx].src}
                    alt={getProductImageAlt({ productName: product.name, variantName: images[imgIdx].color, angle: images[imgIdx].type })}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="absolute inset-0 h-full w-full cursor-zoom-in object-contain"
                    onClick={() => setShowLightbox(true)}
                    priority
                  />
                )}
                {images.length > 1 && (
                  <button
                    onClick={() => setImgIdx((idx) => (idx + 1) % images.length)}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-gray-100"
                    aria-label="Show next product image"
                    title="Show next product image"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.src + idx}
                      onClick={() => setImgIdx(idx)}
                      className={`h-12 w-12 overflow-hidden rounded border-2 p-0 transition-all duration-200 ${idx === imgIdx ? 'border-blue-600 shadow-lg' : 'border-gray-300 hover:border-blue-400'}`}
                      title={`${img.color} ${img.type}`}
                      style={{ background: 'none' }}
                      aria-label={`Show ${product.name} ${img.color} ${img.type} image`}
                      aria-pressed={idx === imgIdx}
                      title={`Show ${product.name} ${img.color} ${img.type} image`}
                    >
                      <Image
                        src={img.src}
                        alt={getProductImageAlt({ productName: product.name, variantName: img.color, angle: img.type, context: 'thumbnail' })}
                        width="96"
                        height="96"
                        className={`h-full w-full object-cover ${idx === imgIdx ? '' : 'opacity-80'}`}
                        draggable={false}
                        loading="lazy"
                        sizes="48px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex w-full flex-shrink-0 flex-col justify-center md:w-[340px]">
              <h1 className="mb-2 text-2xl font-bold">{`${SITE_NAME} ${product.name}`}</h1>
              <p className="mb-2 text-gray-600">{product.description}</p>
              <div className="mt-4">
                <div className="mb-4 flex border-b">
                  {['DETAILS', 'SIZE', 'SIZE GUIDE'].map((item) => (
                    <button
                      key={item}
                      className={`border-b-2 px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none ${tab === item ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                      onClick={() => setTab(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {tab === 'DETAILS' && (
                  <ul className="mb-2 space-y-1 text-sm text-gray-700">
                    {detailsList.map((item) => (
                      <li key={item.label}>
                        <span className="font-semibold">{item.label}:</span> {item.value}
                      </li>
                    ))}
                  </ul>
                )}
                {tab === 'SIZE' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full rounded border border-gray-300 text-left text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          {sizeTable.columns.map((column) => (
                            <th key={column.key} className="border px-3 py-2">
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeTable.rows.map((row) => (
                          <tr key={row.size} className="odd:bg-white even:bg-gray-50">
                            {sizeTable.columns.map((column) => (
                              <td key={column.key} className={`border px-3 py-2 ${column.key === 'size' ? 'font-semibold' : ''}`}>
                                {row[column.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {tab === 'SIZE GUIDE' && (
                  <div className="flex flex-col items-center">
                    <Image src={sizeReferenceImage} alt={`${product.type || 'Product'} size reference`} width="800" height="1000" className="w-full max-w-xs rounded shadow md:max-w-sm" loading="lazy" sizes="(min-width: 768px) 384px, 320px" />
                  </div>
                )}
              </div>
              <div className="mb-4 mt-2">
                <span className="font-semibold">Available Colors:</span>
                <div className="mt-2 flex flex-row flex-wrap gap-2">
                  {variants.map((color, idx) => (
                    <button
                      type="button"
                      key={color.code + idx}
                      className={`flex w-20 cursor-pointer flex-col items-center rounded border p-2 transition-all duration-200 hover:scale-105 ${
                        selectedVariantIndex === idx ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleColorClick(idx)}
                      aria-label={`Select ${color.name} color`}
                      aria-pressed={selectedVariantIndex === idx}
                      title={`Select ${color.name} color`}
                      disabled={color.inStock === false}
                    >
                      <div className="mb-1 text-xs font-medium">{color.name}</div>
                      {color.frontImage && (
                        <Image
                          src={color.frontImage}
                          alt={getProductImageAlt({ productName: product.name, variantName: color.name, angle: 'front', context: 'color option' })}
                          width="48"
                          height="48"
                          className="h-12 w-12 rounded object-cover"
                          loading="lazy"
                          sizes="48px"
                        />
                      )}
                      {color.inStock === false && <div className="mt-1 text-[10px] font-semibold uppercase text-red-600">Sold out</div>}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => openOptions('buy-now')}
                className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] !text-white transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-[0.99]"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => openOptions('add-to-cart')}
                className="mt-3 w-full rounded-full border border-black bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] !text-black transition-all hover:bg-black hover:!text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-[0.99]"
              >
                Add to Cart
              </button>
              {cartMessage && (
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  <p className="font-semibold">✓ {cartMessage}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setCartMessage('')} className="font-semibold underline" title="Continue shopping">
                      Continue Shopping
                    </button>
                    <Link href={ROUTES.cart} className="font-semibold underline">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductOptionsDialog
        open={showOptions}
        product={product}
        mode={purchaseMode}
        initialSelection={{
          variantCode: variants[selectedVariantIndex]?.code,
          variantName: variants[selectedVariantIndex]?.name,
        }}
        fallbackImage={images[0]?.src || ASSETS.heroBgWebp}
        onClose={() => setShowOptions(false)}
        onContinue={handleProductOptionsContinue}
      />

      {showLightbox && images[imgIdx] && (
        <div className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 animate-fade-in" onClick={() => setShowLightbox(false)}>
          {images.length > 1 && (
            <button
              className="absolute left-8 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition-colors hover:bg-black/80 md:left-16"
              onClick={(e) => {
                e.stopPropagation()
                setImgIdx((idx) => (idx - 1 + images.length) % images.length)
              }}
              aria-label="Previous image"
              title="Previous image"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div
            ref={imgContainerRef}
            className="relative flex max-h-full max-w-full aspect-square items-center justify-center overflow-hidden rounded-lg bg-white"
            style={{ width: 'min(80vw, 80vh)', cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              if (!zoom) return
              setDragging(true)
              setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
            }}
            onMouseMove={(e) => {
              if (!dragging) return
              setOffset({ x: e.clientX - start.x, y: e.clientY - start.y })
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onDoubleClick={() => {
              setZoom(!zoom)
              setOffset({ x: 0, y: 0 })
            }}
          >
            <img
              src={images[imgIdx].src}
              alt={getProductImageAlt({ productName: product.name, variantName: images[imgIdx].color, angle: images[imgIdx].type, context: 'zoomed product image' })}
              width="1200"
              height="1200"
              className="h-full w-full select-none rounded-lg border-4 border-white object-contain shadow-2xl"
              style={{
                transform: zoom ? `scale(2) translate(${offset.x / 2}px, ${offset.y / 2}px)` : 'scale(1) translate(0,0)',
                transition: dragging ? 'none' : 'transform 0.3s',
                cursor: zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              draggable={false}
            />
            {!zoom && (
              <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                Double click to zoom
              </div>
            )}
          </div>
          {images.length > 1 && (
            <button
              className="absolute right-8 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition-colors hover:bg-black/80 md:right-16"
              onClick={(e) => {
                e.stopPropagation()
                setImgIdx((idx) => (idx + 1) % images.length)
              }}
              aria-label="Next image"
              title="Next image"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <button
            className="absolute right-6 top-6 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
            onClick={() => setShowLightbox(false)}
            aria-label="Close"
            title="Close"
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default ProductDetailClient
