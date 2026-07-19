import { getAllProducts } from '../lib/data.js'
import { ROUTES, getCanonicalUrl } from '../lib/routes.js'

export const dynamic = 'force-static'

export default function sitemap() {
  const now = new Date()
  const staticRoutes = [ROUTES.home, ROUTES.collections, ROUTES.collectionCategory('top'), ROUTES.collectionCategory('bottom')]

  return [
    ...staticRoutes.map((path) => ({
      url: getCanonicalUrl(path),
      lastModified: now,
      changeFrequency: path === ROUTES.home ? 'weekly' : 'daily',
      priority: path === ROUTES.home ? 1 : 0.8,
    })),
    ...getAllProducts().map((product) => ({
      url: getCanonicalUrl(ROUTES.collectionProduct(product.category || 'top', product.slug)),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}
