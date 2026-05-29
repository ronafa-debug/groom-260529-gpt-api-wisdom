import type { RoleOption } from '../types/wisdom'

interface RolePickerProps {
  roles: RoleOption[]
  selected?: string
  onSelect: (roleId: RoleOption['id']) => void
}

export default function RolePicker({ roles, selected, onSelect }: RolePickerProps) {
  return (
    <div className="grid gap-3">
      {roles.map((role) => {
        const isSelected = selected === role.id
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={[
              'min-h-14 rounded-2xl border px-4 py-4 text-left transition-all',
              isSelected
                ? 'border-sage bg-sage-light shadow-sm'
                : 'border-cream-dark bg-white/70 hover:border-sage/40',
            ].join(' ')}
          >
            <p className="text-base font-semibold text-warm-brown">{role.label}</p>
            <p className="mt-1 text-sm text-warm-brown/70">{role.description}</p>
          </button>
        )
      })}
    </div>
  )
}
