'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard.jsx'
import { ROUTES } from '../lib/routes.js'

const PRODUCTS_PER_PAGE = 16

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
]

const categoryTabs = [
  { label: 'ALL', href: ROUTES.collections, activeKey: 'all' },
  { label: 'TOP', href: ROUTES.collectionCategory('top'), activeKey: 'top' },
  { label: 'BOTTOM', href: ROUTES.collectionCategory('bottom'), activeKey: 'bottom' },
]

const getProductIdNumber = (product) => {
  const id = Number.parseInt(product.id, 10)

  return Number.isNaN(id) ? 0 : id
}

const compareText = (left = '', right = '') => left.localeCompare(right, 'en', { sensitivity: 'base' })

const sortProducts = (items, sortBy) =>
  [...items].sort((leftProduct, rightProduct) => {
    if (sortBy === 'name') {
      const nameOrder = compareText(leftProduct.name, rightProduct.name)

      return nameOrder || getProductIdNumber(rightProduct) - getProductIdNumber(leftProduct)
    }

    return getProductIdNumber(rightProduct) - getProductIdNumber(leftProduct)
  })

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
  sortParamKey = 'sort',
  initialSort = 'newest',
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [sortBy, setSortBy] = useState(initialSort)
  const urlSearch = urlSearchParams.get(searchParamKey) || initialSearch
  const urlPage = Number.parseInt(urlSearchParams.get(pageParamKey) || `${initialPage}`, 10)
  const urlSort = urlSearchParams.get(sortParamKey) || initialSort

  const updateUrl = (nextSearch, nextPage, nextSort = sortBy) => {
    if (!syncUrl) return

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (nextSearch) params.set(searchParamKey, nextSearch)
    else params.delete(searchParamKey)

    if (nextPage > 1) params.set(pageParamKey, String(nextPage))
    else params.delete(pageParamKey)

    if (nextSort && nextSort !== initialSort) params.set(sortParamKey, nextSort)
    else params.delete(sortParamKey)

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase()),
  )

  const sortedProducts = sortProducts(filteredProducts, sortBy)
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1))
  const startIdx = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
  const displayProducts = sortedProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE)

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage)
    }
  }, [currentPage, safeCurrentPage])

  useEffect(() => {
    if (!syncUrl) return

    setSearch(urlSearch)
    setCurrentPage(Number.isNaN(urlPage) ? initialPage : Math.max(1, urlPage))
    setSortBy(SORT_OPTIONS.some((option) => option.value === urlSort) ? urlSort : initialSort)
  }, [initialPage, initialSort, syncUrl, urlPage, urlSearch, urlSort])

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

        <h1 className="mb-4 mt-16 text-center text-3xl font-bold text-gray-900">
          {title}
        </h1>
        {subtitle && <p className="mb-8 text-center text-gray-600">{subtitle}</p>}

        <div className="mx-auto mb-8 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row">
          <form className="flex w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
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
              className="w-full rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="flex w-full max-w-md items-center justify-center gap-2 text-sm font-medium text-gray-700 sm:max-w-none">
            <span className="shrink-0">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => {
                const value = e.target.value
                setSortBy(value)
                setCurrentPage(1)
                updateUrl(search, 1, value)
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

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
                      updateUrl(search, page, sortBy)
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
                onClick={() => {
                  const nextPage = Math.max(1, safeCurrentPage - 1)
                  setCurrentPage(nextPage)
                  updateUrl(search, nextPage, sortBy)
                }}
                className={`rounded px-3 py-1 ${
                  safeCurrentPage > 1 ? 'bg-black text-white hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
                disabled={safeCurrentPage <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextPage = Math.min(totalPages, safeCurrentPage + 1)
                  setCurrentPage(nextPage)
                  updateUrl(search, nextPage, sortBy)
                }}
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
