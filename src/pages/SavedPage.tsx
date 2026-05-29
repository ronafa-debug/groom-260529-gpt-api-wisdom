import { useState } from 'react'
import { Link } from 'react-router-dom'
import WisdomCard from '../components/WisdomCard'
import { getSavedWisdoms, removeSavedWisdom } from '../lib/storage'

export default function SavedPage() {
  const [items, setItems] = useState(() => getSavedWisdoms())

  function handleRemove(id: string) {
    removeSavedWisdom(id)
    setItems(getSavedWisdoms())
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-warm-brown">저장함</h2>
        <div className="rounded-3xl border border-dashed border-cream-dark bg-white/50 px-6 py-10">
          <p className="text-base text-warm-brown/70">아직 저장한 위로가 없어요.</p>
          <p className="mt-2 text-sm text-warm-brown/50">
            마음에 드는 명언을 저장하면 여기에서 다시 읽을 수 있어요.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-sage px-5 py-2 text-sm font-medium text-white"
          >
            위로 찾아보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-warm-brown">저장함</h2>
        <p className="mt-1 text-sm text-warm-brown/70">{items.length}개의 위로가 저장되어 있어요</p>
      </section>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <WisdomCard
              wisdom={item}
              label={
                item.situation
                  ? `${item.situation} · ${new Date(item.savedAt).toLocaleDateString('ko-KR')}`
                  : new Date(item.savedAt).toLocaleDateString('ko-KR')
              }
              saved
              onRemove={() => handleRemove(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
