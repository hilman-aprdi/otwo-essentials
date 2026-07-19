import productsData from '../data/products.json'
import bannersData from '../data/banners.json'
import { normalizeDeep } from './text.js'
import { ROUTES } from './routes.js'

const DISPLAY_COLLECTION_START_ID = 81
const DEFAULT_DISPLAY_ORDER = Number.MAX_SAFE_INTEGER

const getProductDisplayOrder = (product) => {
  if (typeof product.displayOrder === 'number' && Number.isFinite(product.displayOrder)) {
    return product.displayOrder
  }

  return DEFAULT_DISPLAY_ORDER
}

const getProductOrderGroup = (product) => {
  const productId = Number.parseInt(product.id, 10)

  if (Number.isNaN(productId)) return 2

  return productId >= DISPLAY_COLLECTION_START_ID ? 0 : 1
}

const sortProductsForDisplay = (items) =>
  [...items].sort((leftProduct, rightProduct) => {
    const displayOrder = getProductDisplayOrder(leftProduct) - getProductDisplayOrder(rightProduct)

    if (displayOrder !== 0) return displayOrder

    const groupOrder = getProductOrderGroup(leftProduct) - getProductOrderGroup(rightProduct)

    if (groupOrder !== 0) return groupOrder

    return Number.parseInt(leftProduct.id, 10) - Number.parseInt(rightProduct.id, 10)
  })

export const products = sortProductsForDisplay(normalizeDeep(productsData))
export const banners = normalizeDeep(bannersData.banners)

const normalizeCategory = (category = '') => category.toLowerCase()

export const getAllProducts = () => products
export const getBanners = () => banners
export const getProductById = (id) => products.find((product) => product.id === id.toString())
export const getProductBySlug = (slug) => products.find((product) => product.slug === slug)

export const getProductsByCategory = (category) =>
  products.filter((product) => normalizeCategory(product.category) === normalizeCategory(category))

export const getProductsByColor = (color) =>
  products.filter((product) => (product.variants || product.colors || []).some((colorObj) => colorObj.code === color))

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase()

  return products.filter(
    (product) => product.name.toLowerCase().includes(lowercaseQuery) || product.description.toLowerCase().includes(lowercaseQuery),
  )
}

export const getFeaturedProducts = (limit = 8) => products.filter((product) => product.featured === true).slice(0, limit)

export const getAllProductRoutes = () => products.map((product) => ROUTES.collectionProduct(product.category, product.slug))
