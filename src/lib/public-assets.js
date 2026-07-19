import { existsSync } from 'node:fs'
import path from 'node:path'
import { BRAND_OG_IMAGE, getAbsoluteUrl } from './site.js'

export const isPublicAssetPath = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string' || !assetPath.startsWith('/')) return false

  return existsSync(path.join(process.cwd(), 'public', assetPath))
}

export const getPublicAssetUrl = (assetPath, fallbackPath = BRAND_OG_IMAGE) => {
  const safePath = isPublicAssetPath(assetPath) ? assetPath : fallbackPath

  return getAbsoluteUrl(safePath)
}
