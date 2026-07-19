import Link from 'next/link'
import { ROUTES } from '../lib/routes.js'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-4 text-gray-600">The page you are looking for does not exist.</p>
      <Link href={ROUTES.home} className="text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
