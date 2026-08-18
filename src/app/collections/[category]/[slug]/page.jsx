import { notFound } from 'next/navigation'
import ProductDetailClient from '../../../../components/ProductDetailClient.jsx'
import RelatedProducts from '../../../../components/RelatedProducts.jsx'
import StructuredData from '../../../../components/StructuredData.jsx'
import { ROUTES, getCanonicalUrl } from '../../../../lib/routes.js'
import { BRAND_OG_IMAGE, SITE_NAME } from '../../../../lib/site.js'
import { getPublicAssetUrl, isPublicAssetPath } from '../../../../lib/public-assets.js'
import { getProductSeoDescription } from '../../../../lib/product-seo.js'
import { getProductSchema } from '../../../../lib/schema.js'
import { getAllHybridProducts, getHybridProductBySlug } from '../../../../lib/sanity/products.js'

const getProductOgImage = (product) => {
  const variant = (product.variants || product.colors || []).find((color) => isPublicAssetPath(color.frontImage)) || {}

  return variant.frontImage || BRAND_OG_IMAGE
}

const hasInStockVariant = (product) => (product.variants || product.colors || []).some((variant) => variant.inStock === true)

const getRelatedProductCandidates = (currentProduct, products) => {
  const currentThemes = new Set(currentProduct.designTheme || [])
  const candidates = products.filter((product) => {
    if (product.slug === currentProduct.slug) return false
    if (!hasInStockVariant(product)) return false

    return (product.designTheme || []).some((theme) => currentThemes.has(theme))
  })

  if (candidates.length >= 8) return candidates

  const candidateSlugs = new Set(candidates.map((product) => product.slug))
  const fallbackCandidates = products.filter((product) => {
    if (product.slug === currentProduct.slug) return false
    if (candidateSlugs.has(product.slug)) return false
    if (!hasInStockVariant(product)) return false

    return product.category === currentProduct.category || product.type === currentProduct.type
  })

  return [...candidates, ...fallbackCandidates]
}

export async function generateStaticParams() {
  return (await getAllHybridProducts()).map((product) => ({
    category: product.category?.toLowerCase() || 'top',
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { product } = await getHybridProductBySlug(slug)

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
  const description = getProductSeoDescription(product)
  const canonicalUrl = getCanonicalUrl(productPath)
  const ogImage = getPublicAssetUrl(getProductOgImage(product))

  return {
    title: product.name,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
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
  const { product } = await getHybridProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const products = await getAllHybridProducts()
  const category = product.category?.toLowerCase() || routeCategory || 'top'
  const images = (product.variants || product.colors || []).flatMap((color) =>
    [
      color.frontImage ? { src: color.frontImage, color: color.name, type: 'Front' } : null,
      color.backImage ? { src: color.backImage, color: color.name, type: 'Back' } : null,
    ].filter(Boolean),
  )

  const productPath = ROUTES.collectionProduct(category, product.slug)
  const relatedProducts = getRelatedProductCandidates(product, products)

  return (
    <>
      <StructuredData data={getProductSchema({ product, productPath, images: images.length ? images : [{ src: BRAND_OG_IMAGE }] })} />
      <ProductDetailClient product={product} category={category} images={images} productPath={productPath} />
      <RelatedProducts products={relatedProducts} />
    </>
  )
}
