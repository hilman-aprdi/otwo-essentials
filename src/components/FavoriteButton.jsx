'use client'

import { useEffect, useState } from 'react'
import { FAVORITES_CHANGED_EVENT, FAVORITES_STORAGE_KEY } from '../lib/favorites.js'

const getStoredFavorites = () => {
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : []

    return Array.isArray(parsedFavorites) ? parsedFavorites : []
  } catch {
    return []
  }
}

const FavoriteButton = ({ productSlug, className = 'absolute right-3 top-3 z-10' }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const syncFavoriteState = () => {
      setIsFavorite(getStoredFavorites().includes(productSlug))
    }

    syncFavoriteState()
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavoriteState)
    window.addEventListener('storage', syncFavoriteState)

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavoriteState)
      window.removeEventListener('storage', syncFavoriteState)
    }
  }, [productSlug])

  const toggleFavorite = () => {
    const favorites = getStoredFavorites()
    const nextFavorites = favorites.includes(productSlug)
      ? favorites.filter((slug) => slug !== productSlug)
      : [...favorites, productSlug]

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites))
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT))
    setIsFavorite(nextFavorites.includes(productSlug))
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`${className} flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
        isFavorite ? 'border-black bg-black text-white' : 'border-black/10 bg-white/90 text-black hover:bg-white'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
