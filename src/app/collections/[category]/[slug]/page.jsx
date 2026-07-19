import { notFound } from 'next/navigation'
import ProductDetailClient from '../../../../components/ProductDetailClient.jsx'
import StructuredData from '../../../../components/StructuredData.jsx'
import { getAllProducts, getProductBySlug } from '../../../../lib/data.js'
import { ROUTES } from '../../../../lib/routes.js'
import { getProductSchema } from '../../../../lib/schema.js'

export function generateStaticParams() {
  return getAllProducts().map((product) => ({
    category: product.category?.toLowerCase() || 'top',
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.name,
    description: product.description || `Detail produk ${product.name}.`,
  }
}

export default async function ProductDetailPage({ params }) {
  const { category: routeCategory, slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const category = product.category?.toLowerCase() || routeCategory || 'top'
  const images = (product.variants || product.colors || []).flatMap((color) =>
    [
      color.frontImage ? { src: color.frontImage, color: color.name, type: 'Front' } : null,
      color.backImage ? { src: color.backImage, color: color.name, type: 'Back' } : null,
    ].filter(Boolean),
  )

  const productPath = ROUTES.collectionProduct(category, product.slug)

  return (
    <>
      <StructuredData data={getProductSchema({ product, productPath, images: images.length ? images : [{ src: '/assets/hero_bg.jpg' }] })} />
      <ProductDetailClient product={product} category={category} images={images} productPath={productPath} />
    </>
  )
}
