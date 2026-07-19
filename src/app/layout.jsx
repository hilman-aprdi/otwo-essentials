import './globals.css'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { ASSETS, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, getAbsoluteUrl } from '../lib/site.js'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'O2 Essentials - Oversized Streetwear Indonesia',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: '/assets/favico.ico',
    shortcut: '/assets/favico.ico',
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
        url: getAbsoluteUrl(ASSETS.heroBgJpg),
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
    images: [getAbsoluteUrl(ASSETS.heroBgJpg)],
  },
  robots: {
    index: true,
    follow: true,
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
