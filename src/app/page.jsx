import BannerBottom from '../components/BannerBottom.jsx'
import BannerTop from '../components/BannerTop.jsx'
import Featured from '../components/Featured.jsx'
import Gallery from '../components/Gallery.jsx'
import Hero from '../components/Hero.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import StructuredData from '../components/StructuredData.jsx'
import { ROUTES, getCanonicalUrl } from '../lib/routes.js'
import { SITE_DESCRIPTION, SITE_NAME, getAbsoluteUrl } from '../lib/site.js'
import { getOrganizationSchema, getWebSiteSchema } from '../lib/schema.js'

const HOME_OG_IMAGE = getAbsoluteUrl('/banner/images.png')
const HOME_OG_IMAGE_ALT = 'O2 Essentials oversized streetwear collection'

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
        url: HOME_OG_IMAGE,
        secureUrl: HOME_OG_IMAGE,
        type: 'image/png',
        width: 447,
        height: 447,
        alt: HOME_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O2 Essentials - Oversized Streetwear Indonesia',
    description: SITE_DESCRIPTION,
    images: [HOME_OG_IMAGE],
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
