export const getProductSeoDescription = (product) => {
  const description = product.description && product.description !== '-' ? product.description : ''
  const categoryType = [product.category, product.type].filter(Boolean).join(' ')
  const themes = (product.designTheme || []).filter(Boolean).slice(0, 4).join(', ')
  const fallbackDescription = `${product.name} is a ${categoryType || 'fashion essential'} from O2 Essentials, made for everyday streetwear in Indonesia.`
  const details = [
    description || fallbackDescription,
    product.material ? `Material: ${product.material}.` : '',
    themes ? `Design theme: ${themes}.` : '',
  ].filter(Boolean)

  return details.join(' ')
}
