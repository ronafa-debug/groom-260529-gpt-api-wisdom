import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import type { RoleId, Wisdom } from '../../src/types/wisdom'

export const SYSTEM_PROMPT = `당신은 부모와 교사의 마음을 따뜻하게 어루만져 주는 위로 글을 쓰는 동반자입니다.

규칙:
- 한국어로 작성합니다.
- 톤은 따뜻하고, 부드럽고, 판단하지 않으며, 공감 중심이어야 합니다.
- 부모·교사의 역할, 의무, 책임을 강조하거나 더 잘해야 한다는 메시지는 하지 않습니다.
- 훈계, 설교, 잔소리, 뻔한 cliché를 피합니다.
- 지친 마음을 먼저 인정하고, 스스로를 다그치지 않아도 된다는 위로를 전합니다.
- 의학·심리 치료를 대체한다는 표현을 하지 않습니다.
- 아동·학생을 비하하거나 성별·세대 고정관념을 강화하지 않습니다.
- microAction은 부담스럽지 않은, 마음을 가볍게 돌보는 작은 실천이어야 합니다.
- 반드시 아래 JSON 형식만 반환합니다. 다른 텍스트는 포함하지 않습니다.

JSON 형식:
{
  "wisdom": "2~4문장의 따뜻한 위로 명언",
  "attribution": "출처 또는 '오늘을 위한 한마디'",
  "reflection": "2~3문장, 공감과 부드러운 해석",
  "microAction": "오늘 마음을 가볍게 돌볼 작은 한 가지"
}`

const ROLE_LABELS: Record<RoleId, string> = {
  parent: '부모',
  teacher: '교사',
  common: '공통',
}

const SITUATION_LABELS: Record<string, string> = {
  conflict: '아이와 갈등한 뒤',
  burnout: '번아웃·지침',
  guilt: '자책과 죄책감',
  patience: '인내가 필요할 때',
  alone: '혼자라는 느낌',
  'student-difficulty': '학생과의 어려움',
  'respect-loss': '교권·존중 상실',
  'prep-burden': '수업·준비 부담',
  'meaning-loss': '교육 의미를 잃었을 때',
  'teacher-burnout': '번아웃·지침',
  'small-growth': '작은 성장 인정하기',
  'tomorrow-strength': '내일을 위한 힘 모으기',
}

const VALID_ROLES: RoleId[] = ['parent', 'teacher', 'common']

export function buildDailyPrompt(date: string): string {
  return `오늘(${date}) 부모와 교사를 위한 위로 한 장을 작성해 주세요.
역할이나 책임을 이야기하기보다, 지친 마음을 따뜻하게 감싸 주는 메시지로 작성해 주세요.
오늘 하루, 스스로에게도 충분히 잘하고 있다는 느낌이 들 수 있는 부드러운 명언을 만들어 주세요.`
}

export function buildGeneratePrompt(role: RoleId, situationId: string): string {
  const roleLabel = ROLE_LABELS[role]
  const situationLabel = SITUATION_LABELS[situationId] ?? situationId
  return `역할: ${roleLabel}
상황: ${situationLabel}

위 상황에 있는 사람의 마음을 먼저 이해하고, 따뜻하게 위로해 주세요.
역할이나 의무를 강조하지 말고, 공감과 부드러운 격려, 마음을 가볍게 돌볼 작은 한 가지를 포함해 주세요.`
}

export function isValidRole(role: string): role is RoleId {
  return VALID_ROLES.includes(role as RoleId)
}

export function isValidSituationForRole(role: RoleId, situationId: string): boolean {
  const situation = SITUATION_LABELS[situationId]
  if (!situation) return false

  const roleSituations: Record<RoleId, string[]> = {
    parent: ['conflict', 'burnout', 'guilt', 'patience', 'alone'],
    teacher: ['student-difficulty', 'respect-loss', 'prep-burden', 'meaning-loss', 'teacher-burnout'],
    common: ['small-growth', 'tomorrow-strength'],
  }

  return roleSituations[role].includes(situationId)
}

function getKoreaDateString(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(new Date())
}

function parseWisdomJson(content: string): Wisdom {
  const parsed = JSON.parse(content) as Partial<Wisdom>

  if (!parsed.wisdom || !parsed.attribution || !parsed.reflection || !parsed.microAction) {
    throw new Error('Invalid wisdom response structure')
  }

  return {
    wisdom: parsed.wisdom,
    attribution: parsed.attribution,
    reflection: parsed.reflection,
    microAction: parsed.microAction,
  }
}

export async function generateWisdom(
  userPrompt: string,
  temperature: number,
): Promise<Wisdom> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const openai = new OpenAI({ apiKey })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenAI')
  }

  return parseWisdomJson(content)
}

export function getTodayDate(): string {
  return getKoreaDateString()
}

export function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res)
    res.status(200).end()
    return true
  }
  return false
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) {
    return false
  }

  entry.count += 1
  return true
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}
