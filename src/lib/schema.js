import { SITE_NAME, SITE_URL, ASSETS } from './site.js'

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon_o2.png`,
  image: `${SITE_URL}${ASSETS.heroBgJpg}`,
  sameAs: [
    'https://www.instagram.com/o2essentials.id/',
    'https://www.tiktok.com/@o2essentials',
    'https://shopee.co.id/o2essentials',
    'https://tokopedia.com/o2essentials',
  ],
})

export const getProductSchema = ({ product, productPath, images }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description || `Produk premium dari ${SITE_NAME}.`,
  image: images.map((image) => `${SITE_URL}${image.src}`),
  brand: {
    '@type': 'Brand',
    name: SITE_NAME,
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'IDR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}${productPath}`,
  },
})

export const getCollectionSchema = ({ name, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  url: `${SITE_URL}${path}`,
})
