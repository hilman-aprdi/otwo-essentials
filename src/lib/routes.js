import { getAbsoluteUrl } from './site.js'

const COLLECTIONS_BASE = '/collections'

const normalizeCategory = (category = '') => category.toLowerCase()
const withTrailingSlash = (path) => (path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`)

export const ROUTES = {
  home: '/',
  collections: COLLECTIONS_BASE,
  cart: '/cart',
  orderConfirmation: '/order-confirmation',
  collectionCategory: (category) => `${COLLECTIONS_BASE}/${normalizeCategory(category)}`,
  collectionProduct: (category, slug) => `${COLLECTIONS_BASE}/${normalizeCategory(category)}/${slug}`,
  search: '/search',
}

export const getCanonicalUrl = (path) => getAbsoluteUrl(withTrailingSlash(path))
