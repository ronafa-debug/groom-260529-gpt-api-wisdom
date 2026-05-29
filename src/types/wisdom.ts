export interface Wisdom {
  wisdom: string
  attribution: string
  reflection: string
  microAction: string
}

export interface SavedWisdom extends Wisdom {
  id: string
  savedAt: string
  source: 'daily' | 'generated'
  role?: RoleId
  situation?: string
}

export type RoleId = 'parent' | 'teacher' | 'common'

export interface RoleOption {
  id: RoleId
  label: string
  description: string
}

export interface SituationOption {
  id: string
  label: string
  role: RoleId
}

export interface GenerateRequest {
  role: RoleId
  situationId: string
}

export interface WisdomResponse extends Wisdom {
  date?: string
  role?: RoleId
  situationId?: string
}
