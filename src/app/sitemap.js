import { ROUTES, getCanonicalUrl } from '../lib/routes.js'
import { getPublicAssetUrl, isPublicAssetPath } from '../lib/public-assets.js'
import { getAllHybridProducts } from '../lib/sanity/products.js'

export const dynamic = 'force-static'

const getProductSitemapImages = (product) => {
  const images = (product.variants || product.colors || [])
    .flatMap((variant) => [variant.frontImage, variant.backImage])
    .filter(isPublicAssetPath)
    .map((src) => getPublicAssetUrl(src))

  return [...new Set(images)]
}

export default async function sitemap() {
  const now = new Date()
  const staticRoutes = [ROUTES.home, ROUTES.collections, ROUTES.collectionCategory('top'), ROUTES.collectionCategory('bottom')]
  const products = await getAllHybridProducts()

  return [
    ...staticRoutes.map((path) => ({
      url: getCanonicalUrl(path),
      lastModified: now,
      changeFrequency: path === ROUTES.home ? 'weekly' : 'daily',
      priority: path === ROUTES.home ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: getCanonicalUrl(ROUTES.collectionProduct(product.category || 'top', product.slug)),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      images: getProductSitemapImages(product),
    })),
  ]
}
