'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import CartButton from './CartButton.jsx'
import { CART_CHANGED_EVENT, getCartLineItemCount, getStoredCart } from '../lib/cart.js'
import { ROUTES } from '../lib/routes.js'
import { SITE_NAME } from '../lib/site.js'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === ROUTES.home
  const menuId = 'mobile-navigation-menu'

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(searchQuery.trim())}`)
      setMenuOpen(false)
      setSearchQuery('')
    }
  }

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(false)
      return undefined
    }

    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 50
      setIsScrolled((currentIsScrolled) => (currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartLineItemCount(getStoredCart()))

    syncCartCount()
    window.addEventListener(CART_CHANGED_EVENT, syncCartCount)
    window.addEventListener('storage', syncCartCount)

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, syncCartCount)
      window.removeEventListener('storage', syncCartCount)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  let navBg = ''
  if (isHomePage) {
    navBg = isScrolled || isHovered ? 'bg-black/85 shadow-sm backdrop-blur-md' : 'bg-transparent'
  } else {
    navBg = 'bg-black/90 shadow-sm backdrop-blur-md'
  }

  const linkColor = isHomePage && !(isScrolled || isHovered) ? 'text-white/90' : 'text-white'

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 overflow-x-clip text-white transition-all duration-500 ${navBg}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-shrink-0">
          <Link href={ROUTES.home} className="logo-coolvetica text-2xl font-bold tracking-wide text-white md:text-3xl" onClick={() => setMenuOpen(false)}>
            {SITE_NAME}
          </Link>
        </div>

        <div className="min-w-0 flex-1 justify-center md:flex">
          <ul className={`hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] md:flex ${linkColor}`}>
            <li>
              <Link href={ROUTES.home} className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href={ROUTES.collections} className="font-serif font-bold italic hover:text-white">
                Collections
              </Link>
            </li>
            <li>
              <a href="#contacts" className="hover:text-white">
                Contacts
              </a>
            </li>
          </ul>
        </div>

        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <CartButton />
          <form className="flex items-center" onSubmit={handleSearch}>
            <input
              type="text"
              className="min-w-0 w-40 rounded-l-full border border-white/70 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/70 outline-none transition-colors focus:border-white"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="cursor-pointer rounded-r-full border border-white bg-white px-4 py-2 text-black transition-all hover:bg-neutral-200" aria-label="Search" title="Search">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <CartButton />
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            title={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
          >
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id={menuId} className="min-h-[calc(100svh-64px)] w-full max-w-full border-t border-white/10 bg-black/95 px-4 pb-6 pt-5 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-5 text-sm font-semibold uppercase tracking-[0.18em] text-white">
            <li>
              <Link href={ROUTES.home} className={pathname === ROUTES.home ? 'text-white' : 'text-white/75 hover:text-white'} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href={ROUTES.collections} className={pathname.startsWith(ROUTES.collections) ? 'text-white' : 'text-white/75 hover:text-white'} onClick={() => setMenuOpen(false)}>
                Collections
              </Link>
            </li>
            <li>
              <Link href={ROUTES.cart} className={pathname === ROUTES.cart ? 'text-white' : 'text-white/75 hover:text-white'} onClick={() => setMenuOpen(false)}>
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </li>
            <li>
              <a href="#contacts" className="text-white/75 hover:text-white" onClick={() => setMenuOpen(false)}>
                Contacts
              </a>
            </li>
          </ul>
          <div className="mt-7 border-t border-white/10 px-0 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Search Products</p>
            <form className="flex w-full min-w-0 max-[360px]:flex-col max-[360px]:gap-2" onSubmit={handleSearch}>
              <input
                type="text"
                className="min-w-0 flex-1 rounded-l-full border border-white/70 bg-white/10 px-4 py-2 text-base text-white placeholder-white/70 focus:border-white focus:outline-none max-[360px]:rounded-full"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="rounded-r-full border border-white bg-white px-4 py-2 text-base font-bold text-black transition-all max-[360px]:rounded-full" aria-label="Search products" title="Search products">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
