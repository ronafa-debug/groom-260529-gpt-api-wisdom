import type { GenerateRequest, WisdomResponse } from '../types/wisdom'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `요청에 실패했습니다 (${response.status})`)
  }
  return response.json() as Promise<T>
}

export async function fetchDailyWisdom(): Promise<WisdomResponse> {
  const response = await fetch('/api/wisdom/daily')
  return handleResponse<WisdomResponse>(response)
}

export async function generateWisdom(request: GenerateRequest): Promise<WisdomResponse> {
  const response = await fetch('/api/wisdom/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return handleResponse<WisdomResponse>(response)
}
