import { Link, Outlet, useLocation } from 'react-router-dom'
import { APP_NAME_KO } from '../lib/constants'
import BottomNav from './BottomNav'

export default function Layout() {
  const location = useLocation()
  const isAbout = location.pathname === '/about'

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-cream">
      <header className="sticky top-0 z-10 border-b border-cream-dark/60 bg-cream/95 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-sage uppercase">
              Healing Pocket Wisdom
            </p>
            <h1 className="text-lg font-semibold text-warm-brown">{APP_NAME_KO}</h1>
          </div>
          {!isAbout && (
            <Link
              to="/about"
              className="rounded-full px-3 py-2 text-sm text-soft-blue transition-colors hover:bg-soft-blue-light"
            >
              소개
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-5 py-6 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
