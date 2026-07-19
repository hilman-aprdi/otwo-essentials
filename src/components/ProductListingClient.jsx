'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard.jsx'
import { ROUTES } from '../lib/routes.js'

const PRODUCTS_PER_PAGE = 16

const categoryTabs = [
  { label: 'ALL', href: ROUTES.collections, activeKey: 'all' },
  { label: 'TOP', href: ROUTES.collectionCategory('top'), activeKey: 'top' },
  { label: 'BOTTOM', href: ROUTES.collectionCategory('bottom'), activeKey: 'bottom' },
]

const ProductListingClient = ({
  title,
  subtitle,
  products,
  activeTab = 'all',
  showTabs = true,
  backHref,
  backLabel = 'Back',
  searchPlaceholder = 'Search product name...',
  emptyMessage = 'No products found.',
  initialSearch = '',
  initialPage = 1,
  syncUrl = false,
  searchParamKey = 'search',
  pageParamKey = 'page',
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const urlSearch = urlSearchParams.get(searchParamKey) || initialSearch
  const urlPage = Number.parseInt(urlSearchParams.get(pageParamKey) || `${initialPage}`, 10)

  const updateUrl = (nextSearch, nextPage) => {
    if (!syncUrl) return

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (nextSearch) params.set(searchParamKey, nextSearch)
    else params.delete(searchParamKey)

    if (nextPage > 1) params.set(pageParamKey, String(nextPage))
    else params.delete(pageParamKey)

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIdx = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
  const displayProducts = filteredProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE)

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage)
    }
  }, [currentPage, safeCurrentPage])

  useEffect(() => {
    if (!syncUrl) return

    setSearch(urlSearch)
    setCurrentPage(Number.isNaN(urlPage) ? initialPage : Math.max(1, urlPage))
  }, [initialPage, syncUrl, urlPage, urlSearch])

  useEffect(() => {
    if (syncUrl) return
    setCurrentPage(1)
  }, [search, syncUrl])

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        {backHref && (
          <Link href={backHref} className="mb-6 inline-block text-blue-600 hover:underline">
            &larr; {backLabel}
          </Link>
        )}

        <h2 className="mb-4 mt-16 text-center text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {subtitle && <p className="mb-8 text-center text-gray-600">{subtitle}</p>}

        <form className="mb-8 flex justify-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              const value = e.target.value
              setSearch(value)
              setCurrentPage(1)
              updateUrl(value, 1)
            }}
            placeholder={searchPlaceholder}
            className="w-full max-w-md rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-r-lg border border-gray-300 bg-black px-4 py-2 font-semibold text-white transition-all hover:bg-gray-800"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </form>

        {showTabs && (
          <div className="mb-10 flex justify-center gap-4">
            {categoryTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`border px-6 py-2 font-semibold transition-all ${
                  activeTab === tab.activeKey ? 'border-black bg-black !text-white' : 'border-black bg-white !text-black hover:bg-gray-100'
                }`}
              >
                <span className={activeTab === tab.activeKey ? '!text-white' : '!text-black'}>{tab.label}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mb-4 text-center font-medium text-gray-700">
          {filteredProducts.length > 0 ? `Found ${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''}` : emptyMessage}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {displayProducts.length === 0 ? (
            <div className="col-span-4 py-12 text-center text-gray-500">{emptyMessage}</div>
          ) : (
            displayProducts.map((product) => <ProductCard key={product.slug} product={product} />)
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex max-w-full flex-wrap justify-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page)
                      updateUrl(search, page)
                    }}
                    className={`rounded px-3 py-1 ${
                      safeCurrentPage === page ? 'cursor-default bg-blue-600 text-white' : 'cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => {
                    const nextPage = Math.max(1, page - 1)
                    updateUrl(search, nextPage)
                    return nextPage
                  })
                }
                className={`rounded px-3 py-1 ${
                  safeCurrentPage > 1 ? 'bg-black text-white hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
                disabled={safeCurrentPage <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => {
                    const nextPage = Math.min(totalPages, page + 1)
                    updateUrl(search, nextPage)
                    return nextPage
                  })
                }
                className={`rounded px-3 py-1 ${
                  safeCurrentPage < totalPages ? 'bg-black text-white hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
                disabled={safeCurrentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductListingClient
