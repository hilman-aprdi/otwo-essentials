import { Suspense } from 'react'
import ProductListingClient from '../../components/ProductListingClient.jsx'
import StructuredData from '../../components/StructuredData.jsx'
import { getAllProducts } from '../../lib/data.js'
import { ROUTES } from '../../lib/routes.js'
import { SITE_NAME } from '../../lib/site.js'
import { getCollectionSchema } from '../../lib/schema.js'

export const metadata = {
  title: 'Collections',
  description: `Browse the full ${SITE_NAME} collection.`,
}

export default function CollectionsPage() {
  const products = getAllProducts()

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Collection`, path: ROUTES.collections })} />
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
