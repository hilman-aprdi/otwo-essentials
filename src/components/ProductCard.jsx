import Image from 'next/image'
import Link from 'next/link'
import FavoriteButton from './FavoriteButton.jsx'
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
  const hasBackImage = Boolean(backImage)
  const selectedColorName = selectedColor?.name ? `${selectedColor.name} ` : ''

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-0.5">
      <FavoriteButton productSlug={product.slug} className="pointer-events-none absolute right-3 top-3 z-10 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100" />
      <Link href={ROUTES.collectionProduct(category, product.slug)} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={frontImage}
            alt={`${product.name} ${selectedColorName}front view`}
            width="800"
            height="800"
            className={`h-full w-full object-contain p-3 transition-all duration-500 group-hover:scale-[1.025] ${hasBackImage ? 'group-hover:opacity-0' : ''}`}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
          {hasBackImage && (
            <Image
              src={backImage}
              alt={`${product.name} ${selectedColorName}back view`}
              width="800"
              height="800"
              className="absolute inset-0 h-full w-full object-contain p-3 opacity-0 transition-all duration-500 group-hover:scale-[1.025] group-hover:opacity-100"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          )}
        </div>
        <div className="px-3 py-4">
          {showCategory && <p className="mb-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">{product.category}</p>}
          <h3 className="text-center text-sm font-semibold leading-snug text-neutral-950 md:text-base">{product.name}</h3>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
