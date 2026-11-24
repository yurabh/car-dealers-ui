import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <Link to="/cars" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
        Go to all cars
      </Link>
    </div>
  )
}
