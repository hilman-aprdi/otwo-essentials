import { Suspense } from 'react'
import ProductListingClient from '../../components/ProductListingClient.jsx'
import StructuredData from '../../components/StructuredData.jsx'
import { getAllHybridProducts } from '../../lib/sanity/products.js'
import { ROUTES, getCanonicalUrl } from '../../lib/routes.js'
import { ASSETS, SITE_NAME, getAbsoluteUrl } from '../../lib/site.js'
import { getCollectionSchema } from '../../lib/schema.js'

export const metadata = {
  title: 'Oversized T-Shirts & Streetwear Collection',
  description: `Browse the full ${SITE_NAME} collection: oversized t-shirts, tops, bottoms, and everyday streetwear essentials for Indonesia.`,
  alternates: {
    canonical: getCanonicalUrl(ROUTES.collections),
  },
  openGraph: {
    title: `Oversized T-Shirts & Streetwear Collection | ${SITE_NAME}`,
    description: `Browse the full ${SITE_NAME} collection: oversized t-shirts, tops, bottoms, and everyday streetwear essentials for Indonesia.`,
    siteName: SITE_NAME,
    url: getCanonicalUrl(ROUTES.collections),
    images: [{ url: getAbsoluteUrl(ASSETS.bannerNewRelease), width: 1200, height: 630, alt: `${SITE_NAME} Collection` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Oversized T-Shirts & Streetwear Collection | ${SITE_NAME}`,
    description: `Browse the full ${SITE_NAME} collection: oversized t-shirts, tops, bottoms, and everyday streetwear essentials for Indonesia.`,
    images: [getAbsoluteUrl(ASSETS.bannerNewRelease)],
  },
}

export default async function CollectionsPage() {
  const products = await getAllHybridProducts()

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Collection`, path: ROUTES.collections, products })} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListingClient
          title="Explore The Collection"
          subtitle={`Browse the full ${SITE_NAME} collection.`}
          products={products}
          activeTab="all"
          showTabs
          backHref={ROUTES.home}
          backLabel="Back to Home"
          syncUrl
        />
      </Suspense>
    </>
  )
}
