import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '../lib/routes.js'
import { ASSETS, SITE_NAME, SITE_TAGLINE } from '../lib/site.js'

const Hero = () => {
  return (
    <section className="relative -mt-16 flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <Image
        src={ASSETS.heroBgWebp}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75" />
      <div className="relative z-10 px-6 text-center text-white">
        <div className="logo-flip">
          <h1 className="logo-coolvetica text-5xl font-bold tracking-wide text-white md:text-7xl">{SITE_NAME}</h1>
        </div>
        <p className="font-mayonice mx-auto mb-9 max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
          <i>{SITE_TAGLINE}</i>
        </p>
        <Link
          href={ROUTES.collections}
          className="group inline-flex items-center border border-white/80 bg-white/5 px-7 py-3 text-base font-semibold tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:!text-black"
        >
          <span className="text-white transition-colors duration-300 group-hover:!text-black">Shop Now</span>
        </Link>
      </div>
    </section>
  )
}

export default Hero
