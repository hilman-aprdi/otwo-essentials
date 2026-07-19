const COLLECTIONS_BASE = '/collections'
const SITE_URL = 'https://o2essentials.id'

const normalizeCategory = (category = '') => category.toLowerCase()

export const ROUTES = {
  home: '/',
  collections: COLLECTIONS_BASE,
  collectionCategory: (category) => `${COLLECTIONS_BASE}/${normalizeCategory(category)}`,
  collectionProduct: (category, slug) => `${COLLECTIONS_BASE}/${normalizeCategory(category)}/${slug}`,
  search: '/search',
}

export const getCanonicalUrl = (path) => `${SITE_URL}${path}`
