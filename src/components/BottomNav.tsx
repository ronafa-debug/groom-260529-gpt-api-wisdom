import { NavLink } from 'react-router-dom'
import { DEVELOPER_NAME } from '../lib/constants'

const navItems = [
  { to: '/', label: '오늘의 위로', icon: '🌿' },
  { to: '/explore', label: '마음 따라 찾기', icon: '💫' },
  { to: '/saved', label: '저장함', icon: '📖' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-cream-dark/60 bg-cream/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm">
      <ul className="grid grid-cols-3 gap-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'flex min-h-11 flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-sage-light text-sage-dark'
                    : 'text-warm-brown/70 hover:bg-cream-dark/50',
                ].join(' ')
              }
            >
              <span className="mb-0.5 text-base" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <p className="mt-1 pb-0.5 text-center text-[11px] text-warm-brown/45">
        {DEVELOPER_NAME}
      </p>
    </nav>
  )
}
