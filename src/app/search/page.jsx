import { Suspense } from 'react'
import SearchPageClient from '../../components/SearchPageClient.jsx'

export const metadata = {
  title: 'Search Products',
  description: 'Search products in the collection.',
  alternates: {
    canonical: '/search',
  },
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchPageClient />
    </Suspense>
  )
}
