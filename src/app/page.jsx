import BannerBottom from '../components/BannerBottom.jsx'
import BannerTop from '../components/BannerTop.jsx'
import Featured from '../components/Featured.jsx'
import Gallery from '../components/Gallery.jsx'
import Hero from '../components/Hero.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import StructuredData from '../components/StructuredData.jsx'
import { ROUTES } from '../lib/routes.js'
import { SITE_NAME } from '../lib/site.js'
import { getOrganizationSchema } from '../lib/schema.js'

export const metadata = {
  title: `${SITE_NAME} - Premium Fashion Essentials`,
  description: `Shop premium fashion essentials with unique designs and superior comfort. Explore the collection at ${SITE_NAME}.`,
}

const HomePage = () => {
  return (
    <>
      <StructuredData data={getOrganizationSchema()} />
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
