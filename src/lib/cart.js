export const CART_STORAGE_KEY = 'o2essentials_cart'
export const ORDER_DRAFT_STORAGE_KEY = 'o2essentials_order_draft'
export const CART_CHANGED_EVENT = 'o2essentials:cart-changed'
export const ORDER_DRAFT_CHANGED_EVENT = 'o2essentials:order-draft-changed'
export const WHATSAPP_ORDER_NUMBER = '6285117107851'

export const getCartItemKey = ({ productSlug, variantCode, size }) =>
  [productSlug, variantCode || 'default', size || 'unspecified'].join(':')

export const getStoredCart = () => {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    const parsedCart = storedCart ? JSON.parse(storedCart) : []

    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
}

export const saveCart = (items) => {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_CHANGED_EVENT))
}

export const getCartQuantity = (items) =>
  items.reduce((total, item) => total + Math.max(0, Number.parseInt(item.quantity, 10) || 0), 0)

export const getCartLineItemCount = (items) => items.length

export const addCartItem = (item) => {
  const cartItems = getStoredCart()
  const itemKey = getCartItemKey(item)
  const nextQuantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1)
  const existingItem = cartItems.find((cartItem) => cartItem.key === itemKey)

  if (existingItem) {
    const nextCartItems = cartItems.map((cartItem) =>
      cartItem.key === itemKey
        ? {
            ...cartItem,
            quantity: Math.min(99, (Number.parseInt(cartItem.quantity, 10) || 0) + nextQuantity),
          }
        : cartItem,
    )

    saveCart(nextCartItems)
    return nextCartItems
  }

  const nextCartItems = [
    ...cartItems,
    {
      ...item,
      key: itemKey,
      quantity: nextQuantity,
    },
  ]

  saveCart(nextCartItems)
  return nextCartItems
}

export const updateCartItemQuantity = (itemKey, quantity) => {
  const nextQuantity = Math.max(1, Math.min(99, Number.parseInt(quantity, 10) || 1))
  const nextCartItems = getStoredCart().map((item) => (item.key === itemKey ? { ...item, quantity: nextQuantity } : item))

  saveCart(nextCartItems)
  return nextCartItems
}

export const removeCartItem = (itemKey) => {
  const nextCartItems = getStoredCart().filter((item) => item.key !== itemKey)

  saveCart(nextCartItems)
  return nextCartItems
}

export const clearCart = () => saveCart([])

export const replaceCartItem = (itemKey, nextItem) => {
  const cartItems = getStoredCart()
  const nextItemKey = getCartItemKey(nextItem)
  const matchedItem = cartItems.find((item) => item.key === itemKey)
  const duplicateItem = cartItems.find((item) => item.key === nextItemKey && item.key !== itemKey)

  if (duplicateItem) {
    const mergedQuantity = Math.min(
      99,
      (Number.parseInt(duplicateItem.quantity, 10) || 0) + (Number.parseInt(nextItem.quantity, 10) || 1),
    )
    const nextCartItems = cartItems
      .filter((item) => item.key !== itemKey)
      .map((item) => (item.key === nextItemKey ? { ...item, ...nextItem, key: nextItemKey, quantity: mergedQuantity } : item))

    saveCart(nextCartItems)
    return nextCartItems
  }

  const nextCartItems = cartItems.map((item) =>
    item.key === itemKey
      ? {
          ...matchedItem,
          ...nextItem,
          key: nextItemKey,
        }
      : item,
  )

  saveCart(nextCartItems)
  return nextCartItems
}

export const getStoredOrderDraft = () => {
  try {
    const storedDraft = window.sessionStorage.getItem(ORDER_DRAFT_STORAGE_KEY)
    const parsedDraft = storedDraft ? JSON.parse(storedDraft) : null

    return parsedDraft && Array.isArray(parsedDraft.items) ? parsedDraft : null
  } catch {
    return null
  }
}

export const saveOrderDraft = (draft) => {
  window.sessionStorage.setItem(ORDER_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  window.dispatchEvent(new Event(ORDER_DRAFT_CHANGED_EVENT))
}

export const clearOrderDraft = () => {
  window.sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY)
  window.dispatchEvent(new Event(ORDER_DRAFT_CHANGED_EVENT))
}

export const createWhatsAppOrderUrl = ({ items, customer }) => {
  const productLines = items
    .map((item) =>
      [
        item.productName,
        `Color: ${item.variantName || '-'}`,
        `Size: ${item.size || '-'}`,
        `Quantity: ${item.quantity}`,
        item.productUrl ? `Link: ${item.productUrl}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n\n')

  const message = [
    'Halo O² Essentials',
    '',
    'Saya ingin melakukan pemesanan:',
    '',
    productLines,
    '',
    'Customer:',
    `Nama: ${customer.name || '-'}`,
    `WhatsApp: ${customer.phone || '-'}`,
    '',
    'Shipping Address:',
    customer.address || '-',
    '',
    'Notes:',
    customer.notes || '-',
    '',
    'Mohon konfirmasi ketersediaan stok, ongkir, dan metode pembayaran.',
  ].join('\n')

  return `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(message)}`
}
