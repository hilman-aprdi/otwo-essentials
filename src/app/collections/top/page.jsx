import { Suspense } from 'react'
import ProductListingClient from '../../../components/ProductListingClient.jsx'
import StructuredData from '../../../components/StructuredData.jsx'
import { getProductsByCategory } from '../../../lib/data.js'
import { ROUTES } from '../../../lib/routes.js'
import { SITE_NAME } from '../../../lib/site.js'
import { getCollectionSchema } from '../../../lib/schema.js'

export const metadata = {
  title: 'Top Collection',
  description: `Koleksi top premium oversized t-shirt dari ${SITE_NAME}.`,
}

export default function TopPage() {
  const products = getProductsByCategory('top')

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Top Collection`, path: ROUTES.collectionCategory('top') })} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListingClient
          title="TOP Collection"
          subtitle={`Koleksi top premium oversized t-shirt dari ${SITE_NAME}.`}
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
