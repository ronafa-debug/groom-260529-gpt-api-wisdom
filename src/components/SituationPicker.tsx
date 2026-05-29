import type { SituationOption } from '../types/wisdom'

interface SituationPickerProps {
  situations: SituationOption[]
  selected?: string
  onSelect: (situationId: string) => void
}

export default function SituationPicker({
  situations,
  selected,
  onSelect,
}: SituationPickerProps) {
  return (
    <div className="grid gap-2">
      {situations.map((situation) => {
        const isSelected = selected === situation.id
        return (
          <button
            key={situation.id}
            type="button"
            onClick={() => onSelect(situation.id)}
            className={[
              'min-h-12 rounded-xl border px-4 py-3 text-left text-base transition-all',
              isSelected
                ? 'border-sage bg-sage-light font-medium text-sage-dark'
                : 'border-cream-dark bg-white/70 text-warm-brown hover:border-sage/40',
            ].join(' ')}
          >
            {situation.label}
          </button>
        )
      })}
    </div>
  )
}
