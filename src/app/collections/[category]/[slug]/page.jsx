import { notFound } from 'next/navigation'
import ProductDetailClient from '../../../../components/ProductDetailClient.jsx'
import StructuredData from '../../../../components/StructuredData.jsx'
import { getAllProducts, getProductBySlug } from '../../../../lib/data.js'
import { ROUTES } from '../../../../lib/routes.js'
import { ASSETS, SITE_NAME } from '../../../../lib/site.js'
import { getProductSchema } from '../../../../lib/schema.js'

const getProductDescription = (product) => {
  if (product.description && product.description !== '-') return product.description

  return `${product.name} from ${SITE_NAME}. A premium ${product.category || 'fashion'} piece made for everyday streetwear in Indonesia.`
}

const getProductOgImage = (product) => {
  const variant = (product.variants || product.colors || []).find((color) => color.frontImage) || {}

  return variant.frontImage || ASSETS.heroBgJpg
}

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
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const category = product.category?.toLowerCase() || 'top'
  const productPath = ROUTES.collectionProduct(category, product.slug)
  const description = getProductDescription(product)
  const ogImage = getProductOgImage(product)

  return {
    title: product.name,
    description,
    alternates: {
      canonical: productPath,
    },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: productPath,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
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
