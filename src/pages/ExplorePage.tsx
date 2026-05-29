import { useState } from 'react'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import RolePicker from '../components/RolePicker'
import SituationPicker from '../components/SituationPicker'
import WisdomCard from '../components/WisdomCard'
import { generateWisdom } from '../lib/api'
import { getSituationLabel, getSituationsForRole, ROLES } from '../lib/constants'
import { isWisdomSaved, saveWisdom } from '../lib/storage'
import type { RoleId, WisdomResponse } from '../types/wisdom'

type Step = 'role' | 'situation' | 'result'

export default function ExplorePage() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<RoleId | null>(null)
  const [situationId, setSituationId] = useState<string | null>(null)
  const [wisdom, setWisdom] = useState<WisdomResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleGenerate(selectedRole: RoleId, selectedSituation: string) {
    setLoading(true)
    setError(null)
    try {
      const data = await generateWisdom({
        role: selectedRole,
        situationId: selectedSituation,
      })
      setWisdom(data)
      setSaved(isWisdomSaved(data))
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : '명언을 생성하지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function handleRoleSelect(selectedRole: RoleId) {
    setRole(selectedRole)
    setSituationId(null)
    setWisdom(null)
    setError(null)
    setStep('situation')
  }

  function handleSituationSelect(selectedSituation: string) {
    if (!role) return
    setSituationId(selectedSituation)
    handleGenerate(role, selectedSituation)
  }

  function handleSave() {
    if (!wisdom || !role || !situationId) return
    saveWisdom(wisdom, {
      source: 'generated',
      role,
      situation: getSituationLabel(situationId),
    })
    setSaved(true)
  }

  function handleReset() {
    setStep('role')
    setRole(null)
    setSituationId(null)
    setWisdom(null)
    setError(null)
    setSaved(false)
  }

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-2xl font-semibold text-warm-brown">마음 따라 찾기</h2>
        <p className="mt-1 text-sm text-warm-brown/70">
          지금의 마음에 맞는 위로를 찾아보세요
        </p>
      </section>

      {step === 'role' && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-warm-brown">1. 어떤 마음인가요?</p>
          <RolePicker roles={ROLES} selected={role ?? undefined} onSelect={handleRoleSelect} />
        </div>
      )}

      {step === 'situation' && role && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-warm-brown">2. 어떤 상황인가요?</p>
            <button
              type="button"
              onClick={() => setStep('role')}
              className="text-sm text-soft-blue"
            >
              이전
            </button>
          </div>
          <SituationPicker
            situations={getSituationsForRole(role)}
            selected={situationId ?? undefined}
            onSelect={handleSituationSelect}
          />
        </div>
      )}

      {loading && <LoadingSkeleton />}
      {error && <ErrorState message={error} onRetry={() => role && situationId && handleGenerate(role, situationId)} />}

      {step === 'result' && !loading && wisdom && role && situationId && (
        <div className="space-y-4">
          <WisdomCard
            wisdom={wisdom}
            label={`${getSituationLabel(situationId)} · 맞춤 위로`}
            saved={saved}
            onSave={handleSave}
          />
          <button
            type="button"
            onClick={handleReset}
            className="min-h-11 w-full rounded-full border border-cream-dark bg-white/70 py-3 text-sm font-medium text-warm-brown transition-colors hover:bg-cream-dark/40"
          >
            다른 위로 찾기
          </button>
        </div>
      )}
    </div>
  )
}
