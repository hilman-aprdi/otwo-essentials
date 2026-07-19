import { Suspense } from 'react'
import SearchPageClient from '../../components/SearchPageClient.jsx'

export const metadata = {
  title: 'Search Products',
  description: 'Search products in the collection.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchPageClient />
    </Suspense>
  )
}
