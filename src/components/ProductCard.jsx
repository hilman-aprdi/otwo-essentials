import Link from 'next/link'
import { ROUTES } from '../lib/routes.js'

const productUtils = {
  getVariants: (product) => product.variants || product.colors || [],
}

const ProductCard = ({ product, colorFilter, showCategory = true }) => {
  const variants = productUtils.getVariants(product)
  const category = product.category?.toLowerCase() || 'top'

  let selectedColor = variants[0]
  if (colorFilter && colorFilter !== 'all') {
    const match = variants.find((color) => color.code.toLowerCase() === colorFilter)
    if (match) selectedColor = match
  } else {
    selectedColor = variants.find((color) => color.frontImage && color.backImage) || variants[0]
  }

  const shouldSwap = product.swapImage === true
  const frontImage = shouldSwap ? selectedColor?.backImage : selectedColor?.frontImage
  const backImage = shouldSwap ? selectedColor?.frontImage : selectedColor?.backImage

  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5">
      <Link href={ROUTES.collectionProduct(category, product.slug)} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={frontImage}
            alt={product.name}
            width="800"
            height="800"
            className="h-full w-full object-contain p-3 transition-all duration-500 group-hover:scale-[1.025] group-hover:opacity-0"
            loading="lazy"
            decoding="async"
          />
          <img
            src={backImage || frontImage}
            alt={product.name}
            width="800"
            height="800"
            className="absolute inset-0 h-full w-full object-contain p-3 opacity-0 transition-all duration-500 group-hover:scale-[1.025] group-hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="px-3 py-4">
          {showCategory && <p className="mb-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{product.category}</p>}
          <h3 className="text-center text-sm font-semibold leading-snug text-neutral-950 md:text-base">{product.name}</h3>
          {product.price && <p className="mt-1 text-center text-sm text-neutral-600">{product.price}</p>}
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
