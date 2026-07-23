import { BRAND_OG_IMAGE, SITE_NAME, SITE_URL } from './site.js'
import { getPublicAssetUrl } from './public-assets.js'
import { getProductSeoDescription } from './product-seo.js'

const cleanText = (value, fallback = '') => {
  if (!value || value === '-') return fallback
  return String(value).replace(/\s+/g, ' ').trim()
}

const absoluteUrl = (path) => new URL(path, SITE_URL).toString()

const getProductImages = (product, images = []) => {
  const visibleImages = images.length
    ? images
    : (product.variants || product.colors || []).flatMap((variant) => [variant.frontImage, variant.backImage].filter(Boolean).map((src) => ({ src })))

  return visibleImages.length ? visibleImages.map((image) => getPublicAssetUrl(image.src)) : [getPublicAssetUrl(BRAND_OG_IMAGE)]
}

const getProductPrice = (product) => {
  const prices = [product.basePrice, ...(product.variants || product.colors || []).map((variant) => variant.price)]
    .map((price) => Number(price))
    .filter((price) => Number.isFinite(price) && price > 0)

  return prices.length ? Math.min(...prices) : null
}

const getProductAvailability = (product) => {
  const variants = product.variants || product.colors || []
  const hasStock = variants.length === 0 || variants.some((variant) => variant.inStock !== false)

  return hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
}

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/assets/favico.ico'),
  image: getPublicAssetUrl(BRAND_OG_IMAGE),
  sameAs: [
    'https://www.instagram.com/o2essentials.id/',
    'https://www.tiktok.com/@o2essentials',
    'https://shopee.co.id/o2essentialsofficialstore',
    'https://www.tokopedia.com/o2essentialsid',
  ],
})

export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${absoluteUrl('/search/')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const getProductSchema = ({ product, productPath, images }) => {
  const price = getProductPrice(product)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: cleanText(getProductSeoDescription(product), `${product.name} from ${SITE_NAME}.`),
    image: getProductImages(product, images),
    sku: product.id,
    category: [product.category, product.type].filter(Boolean).join(' '),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
  }

  if (price) {
    productSchema.offers = {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price,
      availability: getProductAvailability(product),
      itemCondition: 'https://schema.org/NewCondition',
      url: absoluteUrl(productPath),
    }
  }

  return [
    productSchema,
    getBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      { name: product.category || 'Collection', path: `/collections/${(product.category || 'top').toLowerCase()}` },
      { name: product.name, path: productPath },
    ]),
  ]
}

export const getCollectionSchema = ({ name, path, products = [] }) => [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
  },
  getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Collections', path },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/collections/${(product.category || 'top').toLowerCase()}/${product.slug}`),
      name: product.name,
    })),
  },
]
