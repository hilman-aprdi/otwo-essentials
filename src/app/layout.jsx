import './globals.css'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { BRAND_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, getAbsoluteUrl } from '../lib/site.js'
import { getPublicAssetUrl } from '../lib/public-assets.js'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'O2 Essentials - Oversized Streetwear Indonesia',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: getAbsoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: getAbsoluteUrl('/'),
    siteName: SITE_NAME,
    title: 'O2 Essentials - Oversized Streetwear Indonesia',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: getPublicAssetUrl(BRAND_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: SITE_TAGLINE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O2 Essentials - Oversized Streetwear Indonesia',
    description: SITE_DESCRIPTION,
    images: [getPublicAssetUrl(BRAND_OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'rAX9eRjgxEfjxaZJyxE_ZX9bYupHul2wmpNmcNR4jg4',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
