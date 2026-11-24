import { NavLink, Outlet } from 'react-router'

const navItems = [
  { to: '/cars', label: 'All cars' },
  { to: '/dealers', label: 'All dealers' },
  { to: '/manufacturers', label: 'Manufacturers' },
]

export function AppLayout() {
  return (
    <div className="min-h-svh">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:gap-8">
          <span className="shrink-0 font-semibold whitespace-nowrap text-slate-900">Car Dealers</span>
          <nav className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
