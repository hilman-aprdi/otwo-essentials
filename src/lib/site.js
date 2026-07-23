const ASSET_BASE = '/assets'

export const SITE_NAME = 'o²essentials'
export const SITE_TAGLINE = 'Breath Air, Wear O2'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://otwo-essentials.vercel.app'
export const SITE_DESCRIPTION =
  'O2 Essentials, also known as o2essentials, is an Indonesian streetwear brand offering oversized essentials, premium everyday apparel, and graphic pieces made for daily wear.'

export const getAbsoluteUrl = (path) => new URL(path, SITE_URL).toString()
export const BRAND_OG_IMAGE = `${ASSET_BASE}/hero_bg.webp`

export const ASSETS = {
  heroBgWebp: `${ASSET_BASE}/hero_bg.webp`,
  footerBg: `${ASSET_BASE}/footer_bg.webp`,
  sizeReferences: {
    general: `${ASSET_BASE}/size_reference/general.webp`,
    tShirt: `${ASSET_BASE}/size_reference/t-shirt.webp`,
    flowShirt: `${ASSET_BASE}/size_reference/t-shirt.webp`,
    singlet: `${ASSET_BASE}/size_reference/singlet.jpeg`,
    crewneck: `${ASSET_BASE}/size_reference/crewneck.jpeg`,
    shortPants: `${ASSET_BASE}/size_reference/short-pants.jfif`,
  },
  line: `${ASSET_BASE}/line_o2.webp`,
  galleryDreamBear1: `${ASSET_BASE}/gallery/dream_bear_1.webp`,
  galleryDreamBear2: `${ASSET_BASE}/gallery/dream_bear_2.webp`,
  bannerNewRelease: `${ASSET_BASE}/banner/new_release.webp`,
  bannerNewRelease2: `${ASSET_BASE}/banner/new_release_2.webp`,
  bannerPayday: `${ASSET_BASE}/banner/payday.webp`,
}
