import Link from 'next/link'
import { ROUTES } from '../lib/routes.js'
import { ASSETS, SITE_NAME } from '../lib/site.js'

const Footer = () => {
  return (
    <footer
      className="relative py-16 text-white"
      style={{ backgroundImage: `url('${ASSETS.footerBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="container relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:text-left">
          <div>
            <h3 className="logo-coolvetica text-3xl text-white">{SITE_NAME}</h3>
            <p className="font-qualion mt-2 text-sm italic text-gray-300">Fashion & Apparel</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.18em]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.home} className="text-gray-300 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.collections} className="text-gray-300 transition-colors hover:text-white">
                  Collections
                </Link>
              </li>
              <li>
                <a href="#contacts" className="text-gray-300 transition-colors hover:text-white">
                  Contacts
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 id="contacts" className="mb-4 text-sm font-bold uppercase tracking-[0.18em]">
              Contacts
            </h4>
            <p className="text-gray-300">Email: o2essentials.official@gmail.com</p>
            <p className="mt-2 text-gray-300">Phone: +62-851-1710-7851</p>
          </div>
        </div>
        <div className="relative z-10 mt-10 border-t border-white/15 pt-8 text-center text-gray-400">
          <p className="mb-6 flex items-center justify-center gap-4">
            <a href="https://www.instagram.com/o2essentials.id/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="h-8 w-8 cursor-pointer text-gray-400 transition-all duration-200 hover:brightness-150 hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://shopee.co.id/o2essentialsofficialstore" target="_blank" rel="noopener noreferrer" aria-label="Shopee">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 cursor-pointer text-gray-400 transition-all duration-200 hover:brightness-150 hover:text-white">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" />
                <path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" />
                <path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" />
              </svg>
            </a>
            <a href="https://tokopedia.link/nVz9s1vp9Ub" target="_blank" rel="noopener noreferrer" aria-label="Tokopedia">
              <svg width="24" height="24" className="h-8 w-8 cursor-pointer text-gray-400 transition-all duration-200 hover:brightness-150 hover:text-white" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path fill="currentColor" fillRule="evenodd" d="M96 28c-9.504 0-17.78 5.307-22.008 13.127C82.736 42.123 88.89 44 96 47.332c7.11-3.332 13.264-5.209 22.008-6.205C113.781 33.31 105.506 28 96 28Zm0-12c-15.973 0-29.568 10.117-34.754 24.28C52.932 40 42.462 40 28.53 40H28a6 6 0 0 0-6 6v124a6 6 0 0 0 6 6h92c27.614 0 50-22.386 50-50V46a6 6 0 0 0-6-6h-.531c-13.931 0-24.401 0-32.715.28C125.566 26.113 111.97 16 96 16ZM34 52.001V164h86c20.987 0 38-17.013 38-38V52.001c-18.502.009-29.622.098-37.872.966-8.692.915-13.999 2.677-21.445 6.4a6 6 0 0 1-5.366 0c-7.446-3.723-12.753-5.485-21.445-6.4-8.25-.868-19.37-.957-37.872-.966ZM50 96c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18-18-8.059-18-18Zm18-30c-16.569 0-30 13.431-30 30 0 16.569 13.431 30 30 30 1.126 0 2.238-.062 3.332-.183l20.425 20.426a6 6 0 0 0 8.486 0l20.425-20.426c1.094.121 2.206.183 3.332.183 16.569 0 30-13.431 30-30 0-16.569-13.431-30-30-30-12.764 0-23.666 7.971-28 19.207C91.666 73.971 80.764 66 68 66Zm40.082 55.433A30.1 30.1 0 0 1 96 106.793a30.101 30.101 0 0 1-12.082 14.64L96 133.515l12.082-12.082ZM124 78c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18-8.059-18-18-18ZM76 96a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm48 8a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@o2essentials" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="16" height="16" fill="currentColor" className="h-6 w-6 cursor-pointer text-gray-400 transition-all duration-200 hover:brightness-150 hover:text-white" viewBox="0 0 16 16">
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </a>
          </p>
          <p className="pt-4 text-sm">
            &copy; {new Date().getFullYear()} <span className="logo-coolvetica text-white">{SITE_NAME}</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
