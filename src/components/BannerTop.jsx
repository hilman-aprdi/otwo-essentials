'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ASSETS } from '../lib/site.js'
import { getBanners } from '../lib/data.js'

const fallbackBanners = [
  { id: 1, image: ASSETS.bannerNewRelease, alt: 'New Release' },
  { id: 2, image: ASSETS.bannerNewRelease2, alt: 'New Release' },
]

const cmsBanners = getBanners()
const topBanners = cmsBanners.length > 0 ? cmsBanners : fallbackBanners

const BannerTop = () => {
  const [topSlide, setTopSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTopSlide((prev) => (prev + 1) % topBanners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section className="bg-[#050505] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${topSlide * 100}%)` }}>
              {topBanners.map((banner) => (
                <Image
                  key={banner.id}
                  src={banner.image}
                  alt={banner.alt || 'O2 Essentials campaign banner'}
                  width="1600"
                  height="900"
                  className="aspect-[16/9] min-w-full flex-shrink-0 select-none object-cover"
                  style={{ width: '100%' }}
                  draggable={false}
                  loading="lazy"
                  sizes="(min-width: 1280px) 1280px, calc(100vw - 2rem)"
                />
              ))}
            </div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
              {topBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopSlide(idx)}
                  className={`h-2 w-2 rounded-full ${topSlide === idx ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTopSlide((prev) => (prev - 1 + topBanners.length) % topBanners.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Previous banner"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setTopSlide((prev) => (prev + 1) % topBanners.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Next banner"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section className="bg-[#050505] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-black">
          <a href="https://shopee.co.id/o2essentialsofficialstore" target="_blank" rel="noopener noreferrer" aria-label="Shop O2 Essentials on Shopee" className="block">
            <Image
              src={ASSETS.bannerPayday}
              alt="O2 Essentials payday campaign"
              width="1600"
              height="900"
              className="block h-auto w-full select-none object-contain"
              draggable={false}
              loading="lazy"
              sizes="(min-width: 1280px) 1280px, calc(100vw - 2rem)"
            />
          </a>
        </div>
      </section>
    </>
  )
}

export default BannerTop
