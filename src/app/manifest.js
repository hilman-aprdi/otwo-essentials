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
        src: '/assets/favico.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    id: SITE_URL,
  }
}
