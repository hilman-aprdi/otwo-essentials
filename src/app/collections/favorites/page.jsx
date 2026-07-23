import FavoritesPageClient from '../../../components/FavoritesPageClient.jsx'
import { getAllProducts } from '../../../lib/data.js'
import { ROUTES, getCanonicalUrl } from '../../../lib/routes.js'
import { SITE_NAME } from '../../../lib/site.js'

export const metadata = {
  title: 'Favorite Products',
  description: `Saved ${SITE_NAME} products on this device.`,
  alternates: {
    canonical: getCanonicalUrl(ROUTES.favorites),
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function FavoritesPage() {
  return <FavoritesPageClient products={getAllProducts()} />
}
