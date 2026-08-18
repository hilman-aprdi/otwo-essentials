import { Suspense } from 'react'
import SearchPageClient from '../../components/SearchPageClient.jsx'
import { getAllHybridProducts } from '../../lib/sanity/products.js'

export const metadata = {
  title: 'Search Products',
  description: 'Search products in the collection.',
  alternates: {
    canonical: '/search',
  },
}

export default async function SearchPage() {
  const products = await getAllHybridProducts()

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchPageClient products={products} />
    </Suspense>
  )
}
