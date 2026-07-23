'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard.jsx'
import { FAVORITES_CHANGED_EVENT, FAVORITES_STORAGE_KEY } from '../lib/favorites.js'
import { ROUTES } from '../lib/routes.js'

const getStoredFavorites = () => {
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : []

    return Array.isArray(parsedFavorites) ? parsedFavorites : []
  } catch {
    return []
  }
}

const FavoritesPageClient = ({ products }) => {
  const [favoriteSlugs, setFavoriteSlugs] = useState([])

  useEffect(() => {
    const syncFavorites = () => setFavoriteSlugs(getStoredFavorites())

    syncFavorites()
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorites)
    window.addEventListener('storage', syncFavorites)

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorites)
      window.removeEventListener('storage', syncFavorites)
    }
  }, [])

  const favoriteProducts = products.filter((product) => favoriteSlugs.includes(product.slug))

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link href={ROUTES.collections} className="mb-6 inline-block text-blue-600 hover:underline">
          &larr; Back to Collections
        </Link>

        <h1 className="mb-4 mt-16 text-center text-3xl font-bold text-gray-900">Favorite Products</h1>
        <p className="mb-10 text-center text-gray-600">Your saved O2 Essentials products are stored on this device.</p>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-12 text-center text-gray-600">
            <p className="mb-4">No favorite products yet.</p>
            <Link href={ROUTES.collections} className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-white">
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default FavoritesPageClient
