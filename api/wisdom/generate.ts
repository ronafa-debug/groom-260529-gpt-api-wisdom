import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  buildGeneratePrompt,
  checkRateLimit,
  generateWisdom,
  getClientIp,
  handleOptions,
  isValidRole,
  isValidSituationForRole,
  setCorsHeaders,
} from '../lib/wisdom.js'
import type { RoleId } from '../lib/types.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return

  setCorsHeaders(res)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' })
  }

  try {
    const { role, situationId } = req.body as { role?: string; situationId?: string }

    if (!role || !situationId || !isValidRole(role)) {
      return res.status(400).json({ error: '유효하지 않은 역할 또는 상황입니다.' })
    }

    if (!isValidSituationForRole(role as RoleId, situationId)) {
      return res.status(400).json({ error: '선택한 역할에 맞지 않는 상황입니다.' })
    }

    const wisdom = await generateWisdom(
      buildGeneratePrompt(role as RoleId, situationId),
      0.9,
    )

    return res.status(200).json({
      ...wisdom,
      role,
      situationId,
    })
  } catch (error) {
    console.error('Generate wisdom error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate wisdom'
    return res.status(500).json({ error: message })
  }
}
