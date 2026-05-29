import ShareButton from './ShareButton'
import type { Wisdom } from '../types/wisdom'

interface WisdomCardProps {
  wisdom: Wisdom
  label?: string
  saved?: boolean
  onSave?: () => void
  onRemove?: () => void
}

export default function WisdomCard({
  wisdom,
  label,
  saved = false,
  onSave,
  onRemove,
}: WisdomCardProps) {
  return (
    <article className="rounded-3xl border border-cream-dark bg-white/80 p-6 shadow-sm">
      {label && (
        <p className="mb-3 text-xs font-medium tracking-wide text-sage uppercase">{label}</p>
      )}

      <blockquote className="text-xl leading-relaxed font-medium text-warm-brown">
        “{wisdom.wisdom}”
      </blockquote>

      <p className="mt-3 text-sm text-warm-brown/60">— {wisdom.attribution}</p>

      <div className="mt-6 rounded-2xl bg-sage-light/60 p-4">
        <p className="text-xs font-semibold tracking-wide text-sage-dark uppercase">위로 한마디</p>
        <p className="mt-2 text-base leading-relaxed text-warm-brown">{wisdom.reflection}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-soft-blue-light/70 p-4">
        <p className="text-xs font-semibold tracking-wide text-soft-blue uppercase">
          마음을 가볍게 돌볼 한 가지
        </p>
        <p className="mt-2 text-base leading-relaxed text-warm-brown">{wisdom.microAction}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {onSave && !saved && (
          <button
            type="button"
            onClick={onSave}
            className="min-h-11 rounded-full bg-sage px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
          >
            저장하기
          </button>
        )}
        {saved && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="min-h-11 rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            삭제
          </button>
        )}
        {saved && !onRemove && (
          <span className="inline-flex min-h-11 items-center rounded-full bg-sage-light px-5 py-2 text-sm font-medium text-sage-dark">
            저장됨 ✓
          </span>
        )}
        <ShareButton wisdom={wisdom} />
      </div>
    </article>
  )
}
