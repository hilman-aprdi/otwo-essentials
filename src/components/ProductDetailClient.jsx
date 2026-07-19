'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '../lib/routes.js'
import { ASSETS, SITE_NAME } from '../lib/site.js'

const productUtils = {
  getVariants: (product) => product.variants || product.colors || [],
  getLink: (product, platform) => {
    if (product.links && product.links[platform]) {
      return product.links[platform]
    }
    return null
  },
}

const defaultSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'length', label: 'Length (cm)' },
    { key: 'width', label: 'Width (cm)' },
  ],
  rows: [
    { size: 'S', length: 70, width: 54 },
    { size: 'M', length: 74, width: 58 },
    { size: 'L', length: 78, width: 62 },
    { size: 'XL', length: 82, width: 66 },
  ],
}

const shortPantsSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'bottomLength', label: 'Bottom Length (cm)' },
    { key: 'waistCircumference', label: 'Waist Circumference (cm)' },
    { key: 'width', label: 'Width (cm)' },
  ],
  rows: [
    { size: 'S', bottomLength: '80-92', waistCircumference: 66, width: 45 },
    { size: 'M', bottomLength: '86-96', waistCircumference: 70, width: 47 },
    { size: 'L', bottomLength: '92-102', waistCircumference: 73, width: 49 },
    { size: 'XL', bottomLength: '98-110', waistCircumference: 78, width: 52 },
  ],
}

const crewneckSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'chestWidth', label: 'Chest Width (cm)' },
    { key: 'height', label: 'Height (cm)' },
  ],
  rows: [
    { size: 'S', chestWidth: 54, height: 64 },
    { size: 'M', chestWidth: 57, height: 67 },
    { size: 'L', chestWidth: 60, height: 70 },
    { size: 'XL', chestWidth: 64, height: 74 },
  ],
}

const getSizeTable = (product) => {
  const normalizedCategory = product.category?.toLowerCase()
  const normalizedType = product.type?.toLowerCase()

  if (normalizedCategory === 'bottom' && normalizedType === 'short pants') {
    return shortPantsSizeTable
  }

  if (normalizedCategory === 'top' && normalizedType === 'crewneck') {
    return crewneckSizeTable
  }

  return defaultSizeTable
}

const marketplaceIcons = {
  shopee: (
    <svg className="relative z-10 h-5 w-5 shrink-0 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" />
      <path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" />
      <path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" />
    </svg>
  ),
  tokopedia: (
    <svg className="relative z-10 h-5 w-5 shrink-0 text-white" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M96 28c-9.504 0-17.78 5.307-22.008 13.127C82.736 42.123 88.89 44 96 47.332c7.11-3.332 13.264-5.209 22.008-6.205C113.781 33.31 105.506 28 96 28Zm0-12c-15.973 0-29.568 10.117-34.754 24.28C52.932 40 42.462 40 28.53 40H28a6 6 0 0 0-6 6v124a6 6 0 0 0 6 6h92c27.614 0 50-22.386 50-50V46a6 6 0 0 0-6-6h-.531c-13.931 0-24.401 0-32.715.28C125.566 26.113 111.97 16 96 16ZM34 52.001V164h86c20.987 0 38-17.013 38-38V52.001c-18.502.009-29.622.098-37.872.966-8.692.915-13.999 2.677-21.445 6.4a6 6 0 0 1-5.366 0c-7.446-3.723-12.753-5.485-21.445-6.4-8.25-.868-19.37-.957-37.872-.966ZM50 96c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18-18-8.059-18-18Zm18-30c-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30 1.126 0 2.238-.062 3.332-.183l20.425 20.426a6 6 0 0 0 8.486 0l20.425-20.426c1.094.121 2.206.183 3.332.183 16.569 0 30-13.431 30-30 0-16.569-13.431-30-30-30-12.764 0-23.666 7.971-28 19.207C91.666 73.971 80.764 66 68 66Zm40.082 55.433A30.1 30.1 0 0 1 96 106.793a30.101 30.101 0 0 1-12.082 14.64L96 133.515l12.082-12.082ZM124 78c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18ZM76 96a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm48 8a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" clipRule="evenodd" />
    </svg>
  ),
  tiktok: (
    <svg className="relative z-10 h-4 w-4 shrink-0 text-white" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
    </svg>
  ),
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

  useEffect(() => {
    if (!showLightbox) {
      setZoom(false)
      setOffset({ x: 0, y: 0 })
    }
  }, [showLightbox, imgIdx])

  const variants = productUtils.getVariants(product)
  const sizeTable = getSizeTable(product)
  const detailsList = [
    { label: 'Material', value: product.material || '-' },
    { label: 'Description', value: product.description || '-' },
  ]

  const handleColorClick = (colorIndex) => {
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
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {images[imgIdx] && (
                  <Image
                    src={images[imgIdx].src}
                    alt={`${product.name} ${images[imgIdx].color} ${images[imgIdx].type}`}
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
                    >
                      <Image
                        src={img.src}
                        alt={`${product.name} ${img.color} ${img.type}`}
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
                    <Image src={ASSETS.sizeReference} alt="Size Reference" width="800" height="1000" className="w-full max-w-xs rounded shadow md:max-w-sm" loading="lazy" sizes="(min-width: 768px) 384px, 320px" />
                  </div>
                )}
              </div>
              <div className="mb-4 mt-2">
                <span className="font-semibold">Available Colors:</span>
                <div className="mt-2 flex flex-row gap-2">
                  {variants.map((color, idx) => (
                    <div
                      key={color.code + idx}
                      className={`flex w-20 cursor-pointer flex-col items-center rounded border p-2 transition-all duration-200 hover:scale-105 ${
                        images[imgIdx] && images[imgIdx].color === color.name ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleColorClick(idx)}
                    >
                      <div className="mb-1 text-xs font-medium">{color.name}</div>
                      {color.frontImage && <Image src={color.frontImage} alt={`${color.name} front`} width="48" height="48" className="h-12 w-12 rounded object-cover" loading="lazy" sizes="48px" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 px-4 sm:px-0">
                <h3 className="mb-3 text-center text-2xl font-semibold">BUY AT:</h3>
                <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
                  {[
                    ['shopee', 'https://shopee.co.id/o2essentials', 'Shopee', 'from-orange-500 to-orange-600 border-orange-400 hover:border-orange-300 hover:from-orange-600 hover:to-orange-700'],
                    ['tokopedia', 'https://tokopedia.com/o2essentials', 'Tokopedia', 'from-green-500 to-green-600 border-green-400 hover:border-green-300 hover:from-green-600 hover:to-green-700'],
                    ['tiktok', 'https://www.tiktok.com/@o2essentials', 'TikTok', 'from-black to-gray-800 border-gray-600 hover:border-gray-500 hover:from-gray-800 hover:to-black'],
                  ].map(([platform, fallbackUrl, label, className]) => (
                    <a
                      key={platform}
                      href={productUtils.getLink(product, platform) || fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex w-full transform items-center justify-center gap-2 overflow-hidden rounded-xl border-2 bg-gradient-to-r px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl sm:w-auto sm:min-w-[140px] sm:max-w-[200px] ${className}`}
                    >
                      {marketplaceIcons[platform]}
                      <span className="relative z-10 whitespace-nowrap text-white">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              alt={`${product.name} ${images[imgIdx].color} ${images[imgIdx].type}`}
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
