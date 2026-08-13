import { ASSETS } from './site.js'

export const defaultSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'length', label: 'Length (cm)' },
    { key: 'width', label: 'Width (cm)' },
  ],
  rows: [
    { size: 'S', length: 70, width: 54 },
    { size: 'M', length: 74, width: 58 },
    { size: 'L', length: 78, width: 62 },
    { size: 'XL', length: 82, width: 66 },
  ],
}

export const shortPantsSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'bottomLength', label: 'Bottom Length (cm)' },
    { key: 'waistCircumference', label: 'Waist Circumference (cm)' },
    { key: 'width', label: 'Width (cm)' },
  ],
  rows: [
    { size: 'S', bottomLength: '80-92', waistCircumference: 66, width: 45 },
    { size: 'M', bottomLength: '86-96', waistCircumference: 70, width: 47 },
    { size: 'L', bottomLength: '92-102', waistCircumference: 73, width: 49 },
    { size: 'XL', bottomLength: '98-110', waistCircumference: 78, width: 52 },
  ],
}

export const crewneckSizeTable = {
  columns: [
    { key: 'size', label: 'Size' },
    { key: 'chestWidth', label: 'Chest Width (cm)' },
    { key: 'height', label: 'Height (cm)' },
  ],
  rows: [
    { size: 'S', chestWidth: 54, height: 64 },
    { size: 'M', chestWidth: 57, height: 67 },
    { size: 'L', chestWidth: 60, height: 70 },
    { size: 'XL', chestWidth: 64, height: 74 },
  ],
}

export const getVariants = (product) => product.variants || product.colors || []

export const getSizeTable = (product) => {
  const normalizedCategory = product.category?.toLowerCase()
  const normalizedType = product.type?.toLowerCase()

  if (normalizedCategory === 'bottom' && normalizedType === 'short pants') return shortPantsSizeTable
  if (normalizedCategory === 'top' && normalizedType === 'crewneck') return crewneckSizeTable

  return defaultSizeTable
}

export const getSizeOptions = (product) => getSizeTable(product).rows.map((row) => row.size).filter(Boolean)

export const getSizeReferenceImage = (product) => {
  const normalizedType = product.type?.toLowerCase()

  if (normalizedType === 't-shirt') return ASSETS.sizeReferences.tShirt
  if (normalizedType === 'flow shirt') return ASSETS.sizeReferences.flowShirt
  if (normalizedType === 'singlet') return ASSETS.sizeReferences.singlet
  if (normalizedType === 'crewneck') return ASSETS.sizeReferences.crewneck
  if (normalizedType === 'short pants') return ASSETS.sizeReferences.shortPants

  return ASSETS.sizeReferences.general
}

export const createOrderItem = ({ product, category, productPath, variant, size, quantity, fallbackImage }) => ({
  productId: product.id,
  productSlug: product.slug,
  productName: product.name,
  category: product.category || category,
  type: product.type,
  variantName: variant.name,
  variantCode: variant.code || variant.name,
  size,
  quantity: Math.max(1, Math.min(99, Number.parseInt(quantity, 10) || 1)),
  image: variant.frontImage || fallbackImage,
  productUrl: productPath,
})
