import ProductCard from './ProductCard.jsx'
import { getFeaturedProducts } from '../lib/data.js'

const Featured = () => {
  const featuredProducts = getFeaturedProducts(8)

  return (
    <section className="bg-[#050505] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
          <span className="font-serif italic">Featured</span> Products
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} showCategory={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Featured
