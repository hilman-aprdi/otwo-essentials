import CartPageClient from '../../components/CartPageClient.jsx'
import { getAllProducts } from '../../lib/data.js'
import { ROUTES, getCanonicalUrl } from '../../lib/routes.js'

export const metadata = {
  title: 'Cart',
  description: 'Review your O2 Essentials order before sending it to WhatsApp.',
  alternates: {
    canonical: getCanonicalUrl(ROUTES.cart),
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function CartPage() {
  return <CartPageClient products={getAllProducts()} />
}
