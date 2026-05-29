import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  buildDailyPrompt,
  generateWisdom,
  getTodayDate,
  handleOptions,
  setCorsHeaders,
} from '../lib/wisdom'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return

  setCorsHeaders(res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const date = getTodayDate()
    const wisdom = await generateWisdom(buildDailyPrompt(date), 0.8)

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    return res.status(200).json({ ...wisdom, date })
  } catch (error) {
    console.error('Daily wisdom error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate daily wisdom'
    return res.status(500).json({ error: message })
  }
}
