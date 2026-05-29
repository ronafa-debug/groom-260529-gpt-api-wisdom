# Healing Pocket Wisdom (힐링 포켓 위즈덤)

부모와 교사가 힘들 때, 주머니 속 위로 한 장을 꺼내듯 읽을 수 있는 **모바일 웹 앱**입니다.  
OpenAI GPT API로 **오늘의 명언**과 **상황별 맞춤 위로**를 제공합니다.

**개발:** 오뚝이아빠 김선생

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱명 | Healing Pocket Wisdom (힐링 포켓 위즈덤) |
| 대상 | 자녀 양육·학생 교육 과정에서 지치고 힘이 필요한 **부모**와 **교사** |
| 언어 | 한국어 중심 (UI, GPT 프롬프트, 생성 콘텐츠) |
| 플랫폼 | 모바일 웹 (React SPA) |

### 콘텐츠 방향

명언은 교사·부모의 **역할과 책임을 강조하기보다**, 지친 마음을 **따뜻하게 위로**하는 데 초점을 둡니다.

- 공감과 부드러운 격려 중심
- 훈계·설교·잔소리 지양
- 부담스럽지 않은, 마음을 가볍게 돌보는 작은 실천 제안

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **오늘의 위로** | 하루 1개 공통 명언 (CDN 캐시, `s-maxage=86400`) |
| **마음 따라 찾기** | 부모 / 교사 / 공통 역할 + 상황 선택 → 맞춤 명언 생성 |
| **저장함** | localStorage에 마음에 든 문장 저장·삭제 |
| **공유하기** | Web Share API + 클립보드 복사 fallback |
| **소개** | 앱 목적, AI 안내, 면책, 개발자 정보 |

### 상황 프리셋

**부모:** 아이와 갈등한 뒤 · 번아웃·지침 · 자책과 죄책감 · 인내가 필요할 때 · 혼자라는 느낌  
**교사:** 학생과의 어려움 · 교권·존중 상실 · 수업·준비 부담 · 교육 의미를 잃었을 때 · 번아웃·지침  
**공통:** 작은 성장 인정하기 · 내일을 위한 힘 모으기

---

## 기술 스택

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Router
- **Backend:** Vercel Serverless Functions (`/api/wisdom/*`)
- **AI:** OpenAI GPT API (`gpt-4o-mini`, structured JSON)
- **로컬 개발:** Express 기반 API dev server (`scripts/dev-api.ts`)
- **배포:** GitHub → Vercel

---

## 프로젝트 구조

```
├── api/
│   ├── lib/wisdom.ts       # GPT 프롬프트, OpenAI 호출, rate limit
│   └── wisdom/
│       ├── daily.ts        # GET  /api/wisdom/daily
│       └── generate.ts     # POST /api/wisdom/generate
├── scripts/
│   └── dev-api.ts          # 로컬 API 개발 서버 (port 3000)
├── src/
│   ├── components/         # WisdomCard, BottomNav, Layout, Picker 등
│   ├── pages/              # Home, Explore, Saved, About
│   ├── lib/                # api, storage, constants
│   └── types/              # TypeScript 타입
├── vercel.json             # SPA rewrite
├── .env.example
└── README.md
```

---

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 OpenAI API Key를 설정합니다:

```
OPENAI_API_KEY=sk-...
```

> `.env`는 Git에 포함되지 않습니다. API Key는 절대 커밋하지 마세요.

### 3. 개발 서버 실행

터미널 **2개**에서 각각 실행:

```bash
# 터미널 1 — 백엔드 API (port 3000)
npm run dev:api

# 터미널 2 — 프론트엔드 (port 5151)
npm run dev
```

브라우저에서 **http://localhost:5151** 접속

프론트엔드의 `/api/*` 요청은 Vite 프록시를 통해 `localhost:3000` 백엔드로 전달됩니다.

### Vercel CLI로 실행 (선택)

Vercel 계정 연동 후:

```bash
npx vercel dev
```

---

## 빌드

```bash
npm run build
npm run lint
```

---

## Vercel 배포

1. GitHub 저장소에 push
2. [Vercel](https://vercel.com)에서 Import Project
3. Environment Variables에 `OPENAI_API_KEY` 추가
4. Deploy

배포 후 `/api/wisdom/daily`, `/api/wisdom/generate`가 serverless function으로 동작합니다.

---

## 오류 수정 및 개선 사항

### 로컬 개발 환경

| 문제 | 해결 |
|------|------|
| `vercel dev` 실행 시 Vercel CLI 로그인 필요 | `scripts/dev-api.ts` 로컬 API 서버 추가 (`npm run dev:api`) |
| 프론트엔드만 실행 시 `/api` 프록시 연결 실패 (`ECONNREFUSED`) | 백엔드·프론트엔드 분리 실행 및 Vite proxy 설정 |
| 로컬 포트 불일치 | Vite 기본 포트 **5151**, API **3000**으로 고정 |
| Vercel 배포 500 (`ERR_MODULE_NOT_FOUND`) | API import에 `.js` 확장자 추가, `api/lib/types.ts` 분리, `vercel.json` includeFiles 설정 |

### 앱 기능·콘텐츠

| 항목 | 내용 |
|------|------|
| 명언 톤 조정 | 역할·의무 강조 대신 따뜻한 위로·공감 중심으로 GPT 프롬프트 개선 |
| UI 라벨 | `오늘의 작은 실천` → `마음을 가볍게 돌볼 한 가지` |
| 개발자 표시 | 하단 네비게이션 중앙 및 소개 페이지에 **오뚝이아빠 김선생** 표시 |
| ESLint | `SavedPage` useState 초기화, `HomePage` fetch-on-mount 규칙 정리 |

### 운영 시 참고

- OpenAI API **429 (quota exceeded)** 발생 시: [OpenAI Billing](https://platform.openai.com/settings/organization/billing)에서 크레딧·결제 설정 확인
- `/api/wisdom/generate`는 IP 기준 **분당 5회** rate limit 적용

---

## GPT 응답 형식

```json
{
  "wisdom": "2~4문장의 따뜻한 위로 명언",
  "attribution": "출처 또는 '오늘을 위한 한마디'",
  "reflection": "2~3문장, 공감과 부드러운 해석",
  "microAction": "오늘 마음을 가볍게 돌볼 작은 한 가지"
}
```

---

## 면책

이 앱의 명언은 AI가 생성한 참고용 콘텐츠이며, 전문적인 상담·치료를 대체하지 않습니다.  
마음이 많이 힘들다면 주변의 전문가에게 도움을 요청해 주세요.

---

## 저장소

https://github.com/ronafa-debug/groom-260529-gpt-api-wisdom
