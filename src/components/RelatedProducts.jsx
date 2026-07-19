import ProductCard from './ProductCard.jsx'
import { getProductsByCategory } from '../lib/data.js'

const RelatedProducts = ({ category, excludeId }) => {
  const relatedProducts = getProductsByCategory(category).filter((product) => product.id !== excludeId).slice(0, 4)

  if (relatedProducts.length === 0) return null

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts
