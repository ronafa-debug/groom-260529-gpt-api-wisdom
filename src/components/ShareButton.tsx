import { useState } from 'react'
import { formatWisdomForShare } from '../lib/storage'
import type { Wisdom } from '../types/wisdom'

interface ShareButtonProps {
  wisdom: Wisdom
}

export default function ShareButton({ wisdom }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const text = formatWisdomForShare(wisdom)

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Healing Pocket Wisdom',
          text,
        })
        return
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="min-h-11 rounded-full border border-soft-blue/30 bg-soft-blue-light px-5 py-2 text-sm font-medium text-soft-blue transition-colors hover:bg-soft-blue/10"
    >
      {copied ? '복사됨 ✓' : '공유하기'}
    </button>
  )
}
