import type { RoleId, RoleOption, SituationOption } from '../types/wisdom'

export const APP_NAME = 'Healing Pocket Wisdom'
export const APP_NAME_KO = '힐링 포켓 위즈덤'
export const DEVELOPER_NAME = '오뚝이아빠 김선생'

export const ROLES: RoleOption[] = [
  {
    id: 'parent',
    label: '부모',
    description: '자녀를 키우며 지친 마음',
  },
  {
    id: 'teacher',
    label: '교사',
    description: '학생을 가르치며 버거운 마음',
  },
  {
    id: 'common',
    label: '공통',
    description: '누구에게나 필요한 위로',
  },
]

export const SITUATIONS: SituationOption[] = [
  { id: 'conflict', label: '아이와 갈등한 뒤', role: 'parent' },
  { id: 'burnout', label: '번아웃·지침', role: 'parent' },
  { id: 'guilt', label: '자책과 죄책감', role: 'parent' },
  { id: 'patience', label: '인내가 필요할 때', role: 'parent' },
  { id: 'alone', label: '혼자라는 느낌', role: 'parent' },
  { id: 'student-difficulty', label: '학생과의 어려움', role: 'teacher' },
  { id: 'respect-loss', label: '교권·존중 상실', role: 'teacher' },
  { id: 'prep-burden', label: '수업·준비 부담', role: 'teacher' },
  { id: 'meaning-loss', label: '교육 의미를 잃었을 때', role: 'teacher' },
  { id: 'teacher-burnout', label: '번아웃·지침', role: 'teacher' },
  { id: 'small-growth', label: '작은 성장 인정하기', role: 'common' },
  { id: 'tomorrow-strength', label: '내일을 위한 힘 모으기', role: 'common' },
]

export function getSituationsForRole(role: RoleId): SituationOption[] {
  return SITUATIONS.filter((s) => s.role === role)
}

export function getRoleLabel(role: RoleId): string {
  return ROLES.find((r) => r.id === role)?.label ?? role
}

export function getSituationLabel(situationId: string): string {
  return SITUATIONS.find((s) => s.id === situationId)?.label ?? situationId
}

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

export function buildDailyPrompt(date: string): string {
  return `오늘(${date}) 부모와 교사를 위한 위로 한 장을 작성해 주세요.
역할이나 책임을 이야기하기보다, 지친 마음을 따뜻하게 감싸 주는 메시지로 작성해 주세요.
오늘 하루, 스스로에게도 충분히 잘하고 있다는 느낌이 들 수 있는 부드러운 명언을 만들어 주세요.`
}

export function buildGeneratePrompt(role: RoleId, situationLabel: string): string {
  const roleLabel = getRoleLabel(role)
  return `역할: ${roleLabel}
상황: ${situationLabel}

위 상황에 있는 사람의 마음을 먼저 이해하고, 따뜻하게 위로해 주세요.
역할이나 의무를 강조하지 말고, 공감과 부드러운 격려, 마음을 가볍게 돌볼 작은 한 가지를 포함해 주세요.`
}

export const STORAGE_KEY = 'healing-pocket-wisdom-saved'
