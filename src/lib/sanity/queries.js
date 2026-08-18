import {sanityClient} from './client.js'

export const productFields = `
  _id,
  legacyId,
  name,
  "slug": slug.current,
  category,
  type,
  material,
  description,
  designTheme,
  featured,
  displayOrder,
  swapImage,
  variants[]{
    name,
    code,
    frontImage,
    backImage,
    inStock
  },
  links
`

export const allProductsQuery = `*[_type == "product"] | order(coalesce(displayOrder, 9999) asc, _createdAt desc) {
  ${productFields}
}`

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  ${productFields}
}`

export const featuredProductsQuery = `*[_type == "product" && featured == true] | order(coalesce(displayOrder, 9999) asc, _createdAt desc) {
  ${productFields}
}`

export const bannersQuery = `*[_type == "banner" && active == true] | order(coalesce(displayOrder, 9999) asc, _createdAt desc) {
  _id,
  title,
  imagePath,
  alt,
  link,
  placement,
  active,
  displayOrder
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  description,
  whatsappNumber,
  instagramUrl,
  tiktokUrl,
  shopeeUrl,
  tokopediaUrl
}`

export const fetchSanityProducts = () => sanityClient.fetch(allProductsQuery)

export const fetchSanityProductBySlug = (slug) => sanityClient.fetch(productBySlugQuery, {slug})

export const fetchSanityFeaturedProducts = () => sanityClient.fetch(featuredProductsQuery)

export const fetchSanityBanners = () => sanityClient.fetch(bannersQuery)

export const fetchSanitySiteSettings = () => sanityClient.fetch(siteSettingsQuery)
