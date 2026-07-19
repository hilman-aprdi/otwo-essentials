import Image from 'next/image'
import { ASSETS } from '../lib/site.js'

const galleryImages = [ASSETS.galleryDreamBear1, ASSETS.galleryDreamBear2, ASSETS.line]

const MarqueeImage = ({ src, alt, direction = 'left' }) => (
  <div className="marquee-container">
    <div className={`marquee-track ${direction === 'right' ? 'marquee-track-reverse' : ''}`}>
      <Image src={src} alt={alt} width="1600" height="200" className="h-auto w-screen object-cover object-center opacity-90" loading="lazy" sizes="100vw" />
      <Image src={src} alt={alt} width="1600" height="200" className="h-auto w-screen object-cover object-center opacity-90" loading="lazy" sizes="100vw" />
    </div>
  </div>
)

const Gallery = () => {
  return (
    <section className="bg-[#050505] py-0">
      <MarqueeImage src={galleryImages[2]} alt="Gallery line" direction="left" />
      <div className="grid w-full grid-cols-2 gap-px bg-white/10">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-black">
          <Image
            src={galleryImages[0]}
            alt="Gallery 3"
            width="1200"
            height="1200"
            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
            loading="lazy"
            sizes="50vw"
          />
        </div>
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-black">
          <Image
            src={galleryImages[1]}
            alt="Gallery 4"
            width="1200"
            height="1200"
            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
            loading="lazy"
            sizes="50vw"
          />
        </div>
      </div>
      <MarqueeImage src={galleryImages[2]} alt="Gallery line" direction="right" />
    </section>
  )
}

export default Gallery
