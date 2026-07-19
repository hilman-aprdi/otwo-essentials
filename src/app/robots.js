import { SITE_URL } from '../lib/site.js'

export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/search', '/api', '/cart', '/checkout', '/account'],
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  }
}
