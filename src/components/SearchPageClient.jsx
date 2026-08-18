import ProductListingClient from './ProductListingClient.jsx'

const SearchPageClient = ({ products }) => {
  return (
    <ProductListingClient
      title="Search Results"
      subtitle="Search products in the collection."
      products={products}
      activeTab="all"
      showTabs={false}
      backHref="/collections"
      backLabel="Back to Collections"
      searchPlaceholder="Search product name or description..."
      emptyMessage="No products found."
      syncUrl
      searchParamKey="q"
    />
  )
}

export default SearchPageClient
