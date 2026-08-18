import { getAllProducts, getFeaturedProducts, getProductBySlug } from '../data.js'
import { fetchSanityFeaturedProducts, fetchSanityProductBySlug, fetchSanityProducts } from './queries.js'
import { getProductValidationIssues, normalizeSanityProduct } from './normalize-product.js'

export const PRODUCT_DATA_SOURCE = process.env.PRODUCT_DATA_SOURCE || 'local'

const normalizeSanityProducts = (products) => (Array.isArray(products) ? products.map(normalizeSanityProduct) : [])

const isSanityDataSource = () => ['sanity', 'hybrid'].includes(PRODUCT_DATA_SOURCE)

const mergeProductsBySlug = (localProducts, sanityProducts) => {
  const mergedProducts = new Map(localProducts.map((product) => [product.slug, product]))

  sanityProducts.forEach((product) => {
    if (product.slug) mergedProducts.set(product.slug, product)
  })

  return [...mergedProducts.values()]
}

const getErrorMessage = (error) => {
  if (!error) return ''

  return error.message || String(error)
}

export const getSanityProductReport = async () => {
  try {
    const products = normalizeSanityProducts(await fetchSanityProducts())
    const productReports = products.map((product) => ({
      product,
      issues: getProductValidationIssues(product, { validatePublicAssets: true }),
    }))
    const validProducts = productReports.filter((item) => item.issues.length === 0).map((item) => item.product)

    return {
      source: 'sanity',
      products,
      validProducts,
      productReports,
      error: '',
    }
  } catch (error) {
    const fallbackProducts = getAllProducts()

    return {
      source: 'local',
      products: fallbackProducts,
      validProducts: fallbackProducts,
      productReports: fallbackProducts.map((product) => ({
        product,
        issues: [],
      })),
      error: getErrorMessage(error),
    }
  }
}

export const getAllHybridProducts = async () => {
  if (!isSanityDataSource()) return getAllProducts()

  const report = await getSanityProductReport()

  if (PRODUCT_DATA_SOURCE === 'hybrid') {
    return mergeProductsBySlug(getAllProducts(), report.validProducts)
  }

  return report.validProducts.length > 0 ? report.validProducts : getAllProducts()
}

export const getHybridProductBySlug = async (slug) => {
  if (!isSanityDataSource()) {
    return {
      source: 'local',
      product: getProductBySlug(slug),
      error: '',
    }
  }

  try {
    const product = normalizeSanityProduct(await fetchSanityProductBySlug(slug))
    const issues = getProductValidationIssues(product, { validatePublicAssets: true })

    if (product.slug && issues.length === 0) {
      return {
        source: 'sanity',
        product,
        error: '',
      }
    }
  } catch (error) {
    return {
      source: 'local',
      product: getProductBySlug(slug),
      error: getErrorMessage(error),
    }
  }

  return {
    source: 'local',
    product: getProductBySlug(slug),
    error: '',
  }
}

export const getHybridFeaturedProducts = async (limit = 8) => {
  if (!isSanityDataSource()) return getFeaturedProducts(limit)

  if (PRODUCT_DATA_SOURCE === 'hybrid') {
    return (await getAllHybridProducts()).filter((product) => product.featured === true).slice(0, limit)
  }

  try {
    const products = normalizeSanityProducts(await fetchSanityFeaturedProducts())
    const validProducts = products.filter((product) => getProductValidationIssues(product, { validatePublicAssets: true }).length === 0)

    if (validProducts.length > 0) return validProducts.slice(0, limit)
  } catch {
    return getFeaturedProducts(limit)
  }

  return getFeaturedProducts(limit)
}
