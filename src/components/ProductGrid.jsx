import Link from 'next/link'
import ProductCard from './ProductCard.jsx'
import { ROUTES } from '../lib/routes.js'
import { getAllHybridProducts } from '../lib/sanity/products.js'

const ProductGrid = async () => {
  const displayProducts = (await getAllHybridProducts()).slice(0, 16)

  return (
    <section className="bg-[#f5f2ed] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
          Explore The <span className="font-serif italic">Collection</span>
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.slug} product={product} showCategory={false} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={ROUTES.collections} className="inline-flex items-center rounded-full bg-black px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-white transition-colors hover:bg-neutral-800">
            <span className="!text-white">View More Products</span>
            <svg className="ml-2 h-5 w-5 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
