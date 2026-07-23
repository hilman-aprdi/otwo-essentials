'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'

const MAX_RELATED_PRODUCTS = 8

const shuffleProducts = (products) => {
  const shuffledProducts = [...products]

  for (let index = shuffledProducts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledProducts[index], shuffledProducts[randomIndex]] = [shuffledProducts[randomIndex], shuffledProducts[index]]
  }

  return shuffledProducts
}

const RelatedProducts = ({ products }) => {
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    setRelatedProducts(shuffleProducts(products).slice(0, MAX_RELATED_PRODUCTS))
  }, [products])

  if (products.length === 0) return null

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
