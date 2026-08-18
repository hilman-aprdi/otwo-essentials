import OrderConfirmationClient from '../../components/OrderConfirmationClient.jsx'
import { getAllHybridProducts } from '../../lib/sanity/products.js'
import { ROUTES, getCanonicalUrl } from '../../lib/routes.js'

export const metadata = {
  title: 'Order Confirmation',
  description: 'Review your O2 Essentials order before continuing to WhatsApp.',
  alternates: {
    canonical: getCanonicalUrl(ROUTES.orderConfirmation),
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function OrderConfirmationPage() {
  return <OrderConfirmationClient products={await getAllHybridProducts()} />
}
