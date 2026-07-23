import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site.js'

export const dynamic = 'force-static'

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: 'O2 Essentials',
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    id: SITE_URL,
  }
}
