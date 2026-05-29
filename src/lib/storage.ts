import { STORAGE_KEY } from './constants'
import type { SavedWisdom, Wisdom } from '../types/wisdom'

function readSaved(): SavedWisdom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedWisdom[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSaved(items: SavedWisdom[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getSavedWisdoms(): SavedWisdom[] {
  return readSaved().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  )
}

export function saveWisdom(
  wisdom: Wisdom,
  meta: Pick<SavedWisdom, 'source' | 'role' | 'situation'>,
): SavedWisdom {
  const items = readSaved()
  const id = crypto.randomUUID()
  const saved: SavedWisdom = {
    ...wisdom,
    id,
    savedAt: new Date().toISOString(),
    ...meta,
  }
  writeSaved([saved, ...items])
  return saved
}

export function removeSavedWisdom(id: string): void {
  writeSaved(readSaved().filter((item) => item.id !== id))
}

export function isWisdomSaved(wisdom: Wisdom): boolean {
  return readSaved().some(
    (item) =>
      item.wisdom === wisdom.wisdom &&
      item.reflection === wisdom.reflection &&
      item.microAction === wisdom.microAction,
  )
}

export function formatWisdomForShare(wisdom: Wisdom): string {
  return `${wisdom.wisdom}\n\n— ${wisdom.attribution}\n\n💭 ${wisdom.reflection}\n\n✨ 마음을 가볍게 돌볼 한 가지: ${wisdom.microAction}\n\n#HealingPocketWisdom #힐링포켓위즈덤`
}
