import { Suspense } from 'react'
import ProductListingClient from '../../../components/ProductListingClient.jsx'
import StructuredData from '../../../components/StructuredData.jsx'
import { getProductsByCategory } from '../../../lib/data.js'
import { ROUTES } from '../../../lib/routes.js'
import { ASSETS, SITE_NAME } from '../../../lib/site.js'
import { getCollectionSchema } from '../../../lib/schema.js'

export const metadata = {
  title: 'Streetwear Bottoms',
  description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
  alternates: {
    canonical: ROUTES.collectionCategory('bottom'),
  },
  openGraph: {
    title: `Streetwear Bottoms | ${SITE_NAME}`,
    description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
    url: ROUTES.collectionCategory('bottom'),
    images: [{ url: ASSETS.bannerPayday, width: 1200, height: 630, alt: `${SITE_NAME} Bottom Collection` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Streetwear Bottoms | ${SITE_NAME}`,
    description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
    images: [ASSETS.bannerPayday],
  },
}

export default function BottomPage() {
  const products = getProductsByCategory('bottom')

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Bottom Collection`, path: ROUTES.collectionCategory('bottom'), products })} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListingClient
          title="BOTTOM Collection"
          subtitle={`Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`}
          products={products}
          activeTab="bottom"
          showTabs
          backHref={ROUTES.collections}
          backLabel="Back to Collections"
          syncUrl
        />
      </Suspense>
    </>
  )
}
