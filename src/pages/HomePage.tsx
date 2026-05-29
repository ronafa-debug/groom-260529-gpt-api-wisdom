import { useCallback, useEffect, useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import WisdomCard from '../components/WisdomCard'
import { fetchDailyWisdom } from '../lib/api'
import { isWisdomSaved, saveWisdom } from '../lib/storage'
import type { WisdomResponse } from '../types/wisdom'

export default function HomePage() {
  const [wisdom, setWisdom] = useState<WisdomResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const loadDaily = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDailyWisdom()
      setWisdom(data)
      setSaved(isWisdomSaved(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : '오늘의 위로를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount for daily wisdom
    void loadDaily()
  }, [loadDaily])

  function handleSave() {
    if (!wisdom) return
    saveWisdom(wisdom, { source: 'daily' })
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-2xl font-semibold text-warm-brown">오늘의 위로</h2>
        <p className="mt-1 text-sm text-warm-brown/70">
          부모와 교사를 위한, 오늘 하루의 따뜻한 한 장
        </p>
      </section>

      {loading && <LoadingSkeleton />}
      {error && <ErrorState message={error} onRetry={loadDaily} />}
      {!loading && !error && wisdom && (
        <WisdomCard
          wisdom={wisdom}
          label={wisdom.date ? `${wisdom.date} · 오늘의 위로` : '오늘의 위로'}
          saved={saved}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
