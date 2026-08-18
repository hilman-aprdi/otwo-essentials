import { Suspense } from 'react'
import ProductListingClient from '../../../components/ProductListingClient.jsx'
import StructuredData from '../../../components/StructuredData.jsx'
import { getAllHybridProducts } from '../../../lib/sanity/products.js'
import { ROUTES, getCanonicalUrl } from '../../../lib/routes.js'
import { ASSETS, SITE_NAME, getAbsoluteUrl } from '../../../lib/site.js'
import { getCollectionSchema } from '../../../lib/schema.js'

export const metadata = {
  title: 'Streetwear Bottoms',
  description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
  alternates: {
    canonical: getCanonicalUrl(ROUTES.collectionCategory('bottom')),
  },
  openGraph: {
    title: `Streetwear Bottoms | ${SITE_NAME}`,
    description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
    siteName: SITE_NAME,
    url: getCanonicalUrl(ROUTES.collectionCategory('bottom')),
    images: [{ url: getAbsoluteUrl(ASSETS.bannerPayday), width: 1200, height: 630, alt: `${SITE_NAME} Bottom Collection` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Streetwear Bottoms | ${SITE_NAME}`,
    description: `Premium streetwear bottoms from ${SITE_NAME}, made for comfortable daily outfits.`,
    images: [getAbsoluteUrl(ASSETS.bannerPayday)],
  },
}

export default async function BottomPage() {
  const products = (await getAllHybridProducts()).filter((product) => product.category?.toLowerCase() === 'bottom')

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
