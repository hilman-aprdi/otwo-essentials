import { Suspense } from 'react'
import ProductListingClient from '../../../components/ProductListingClient.jsx'
import StructuredData from '../../../components/StructuredData.jsx'
import { getProductsByCategory } from '../../../lib/data.js'
import { ROUTES } from '../../../lib/routes.js'
import { SITE_NAME } from '../../../lib/site.js'
import { getCollectionSchema } from '../../../lib/schema.js'

export const metadata = {
  title: 'Bottom Collection',
  description: `Koleksi bottom premium dari ${SITE_NAME}.`,
}

export default function BottomPage() {
  const products = getProductsByCategory('bottom')

  return (
    <>
      <StructuredData data={getCollectionSchema({ name: `${SITE_NAME} Bottom Collection`, path: ROUTES.collectionCategory('bottom') })} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductListingClient
          title="BOTTOM Collection"
          subtitle={`Koleksi bottom premium dari ${SITE_NAME}.`}
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
