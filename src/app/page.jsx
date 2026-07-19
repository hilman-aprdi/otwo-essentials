import BannerBottom from '../components/BannerBottom.jsx'
import BannerTop from '../components/BannerTop.jsx'
import Featured from '../components/Featured.jsx'
import Gallery from '../components/Gallery.jsx'
import Hero from '../components/Hero.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import StructuredData from '../components/StructuredData.jsx'
import { ROUTES, getCanonicalUrl } from '../lib/routes.js'
import { ASSETS, SITE_DESCRIPTION, SITE_NAME, getAbsoluteUrl } from '../lib/site.js'
import { getOrganizationSchema, getWebSiteSchema } from '../lib/schema.js'

export const metadata = {
  title: {
    absolute: 'O2 Essentials - Oversized Streetwear Indonesia',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: getCanonicalUrl(ROUTES.home),
  },
  openGraph: {
    title: 'O2 Essentials - Oversized Streetwear Indonesia',
    description: SITE_DESCRIPTION,
    url: getCanonicalUrl(ROUTES.home),
    images: [
      {
        url: getAbsoluteUrl(ASSETS.heroBgJpg),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O2 Essentials - Oversized Streetwear Indonesia',
    description: SITE_DESCRIPTION,
    images: [getAbsoluteUrl(ASSETS.heroBgJpg)],
  },
}

const HomePage = () => {
  return (
    <>
      <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
      <div className="min-h-screen">
        <Hero />
        <BannerTop />
        <Featured />
        <Gallery />
        <BannerBottom />
        <ProductGrid />
      </div>
    </>
  )
}

export default HomePage
