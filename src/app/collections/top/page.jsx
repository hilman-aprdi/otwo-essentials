import { Suspense } from 'react'
import ProductListingClient from '../../../components/ProductListingClient.jsx'
import StructuredData from '../../../components/StructuredData.jsx'
import { getProductsByCategory } from '../../../lib/data.js'
import { ROUTES } from '../../../lib/routes.js'
import { ASSETS, SITE_NAME } from '../../../lib/site.js'
import { getCollectionSchema } from '../../../lib/schema.js'

export const metadata = {
  title: 'Oversized T-Shirts',
  description: `Premium oversized t-shirts and tops from ${SITE_NAME}, designed for everyday streetwear.`,
  alternates: {
    canonical: ROUTES.collectionCategory('top'),
  },
  openGraph: {
    title: `Oversized T-Shirts | ${SITE_NAME}`,
    description: `Premium oversized t-shirts and tops from ${SITE_NAME}, designed for everyday streetwear.`,
    url: ROUTES.collectionCategory('top'),
    images: [{ url: ASSETS.bannerNewRelease, width: 1200, height: 630, alt: `${SITE_NAME} Top Collection` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Oversized T-Shirts | ${SITE_NAME}`,
    description: `Premium oversized t-shirts and tops from ${SITE_NAME}, designed for everyday streetwear.`,
    images: [ASSETS.bannerNewRelease],
  },
}

export default function TopPage() {
  const products = getProductsByCategory('top')

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Top Collection`, path: ROUTES.collectionCategory('top'), products })} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListingClient
          title="TOP Collection"
          subtitle={`Premium oversized t-shirts and tops from ${SITE_NAME}, designed for everyday streetwear.`}
          products={products}
          activeTab="top"
          showTabs
          backHref={ROUTES.collections}
          backLabel="Back to Collections"
          syncUrl
        />
      </Suspense>
    </>
  )
}
