import { isPublicAssetPath } from '../public-assets.js'

const normalizeSlug = (slug) => {
  if (!slug) return ''
  if (typeof slug === 'string') return slug

  return slug.current || ''
}

const normalizeVariant = (variant = {}) => ({
  name: variant.name || '',
  code: variant.code || '',
  frontImage: variant.frontImage || '',
  backImage: variant.backImage || '',
  inStock: variant.inStock !== false,
})

export const normalizeSanityProduct = (product = {}) => ({
  id: product.legacyId || product.id || product._id || '',
  slug: normalizeSlug(product.slug),
  category: product.category || '',
  type: product.type || '',
  name: product.name || '',
  material: product.material || '',
  description: product.description || '-',
  designTheme: Array.isArray(product.designTheme) ? product.designTheme : [],
  featured: product.featured === true,
  displayOrder: Number.isFinite(product.displayOrder) ? product.displayOrder : undefined,
  swapImage: product.swapImage === true,
  variants: Array.isArray(product.variants) ? product.variants.map(normalizeVariant) : [],
  links: product.links || {},
})

export const getProductValidationIssues = (product = {}, options = {}) => {
  const { validatePublicAssets = false } = options
  const issues = []

  if (!product.name) issues.push('Missing product name')
  if (!product.slug) issues.push('Missing slug')
  if (!product.category) issues.push('Missing category')
  if (!Array.isArray(product.variants) || product.variants.length === 0) {
    issues.push('Product must have at least one variant')
  }

  ;(product.variants || []).forEach((variant, index) => {
    const label = `Variant ${index + 1}`
    const hasAnyImage = Boolean(variant.frontImage || variant.backImage)

    if (!variant.name) issues.push(`${label}: missing color name`)
    if (!variant.code) issues.push(`${label}: missing color code`)
    if (!hasAnyImage) issues.push(`${label}: missing image path`)
    if (variant.frontImage && !variant.frontImage.startsWith('/')) issues.push(`${label}: front image should start with /`)
    if (variant.backImage && !variant.backImage.startsWith('/')) issues.push(`${label}: back image should start with /`)
    if (validatePublicAssets && variant.frontImage && variant.frontImage.startsWith('/') && !isPublicAssetPath(variant.frontImage)) {
      issues.push(`${label}: front image does not exist in public`)
    }
    if (validatePublicAssets && variant.backImage && variant.backImage.startsWith('/') && !isPublicAssetPath(variant.backImage)) {
      issues.push(`${label}: back image does not exist in public`)
    }
  })

  return issues
}
