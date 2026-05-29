import { Link } from 'react-router-dom'
import { APP_NAME, APP_NAME_KO, DEVELOPER_NAME } from '../lib/constants'

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section>
        <Link to="/" className="text-sm text-soft-blue">
          ← 돌아가기
        </Link>
        <h2 className="mt-4 text-2xl font-semibold text-warm-brown">앱 소개</h2>
      </section>

      <article className="space-y-4 rounded-3xl border border-cream-dark bg-white/80 p-6 text-base leading-relaxed text-warm-brown">
        <p>
          <strong>{APP_NAME_KO}</strong>({APP_NAME})는 부모와 교사가 힘들고 지칠 때, 주머니 속
          위로 한 장을 꺼내듯 읽을 수 있는 모바일 웹 앱입니다.
        </p>
        <p>
          자녀를 키우거나 학생을 가르치는 일은 사랑이지만, 때로는 자책과 번아웃, 외로움이
          찾아옵니다. 이 앱은 그런 순간에 마음을 다독이는 명언과 작은 실천을 제공합니다.
        </p>
      </article>

      <section className="rounded-3xl border border-cream-dark bg-sage-light/40 p-6">
        <h3 className="text-lg font-semibold text-sage-dark">기능</h3>
        <ul className="mt-3 space-y-2 text-sm text-warm-brown">
          <li>· 오늘의 위로 — 매일 하나의 공통 명언</li>
          <li>· 마음 따라 찾기 — 역할과 상황에 맞는 맞춤 위로</li>
          <li>· 저장함 — 마음에 든 문장 보관</li>
          <li>· 공유하기 — 위로를 나누기</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-cream-dark bg-soft-blue-light/50 p-6">
        <h3 className="text-lg font-semibold text-soft-blue">AI 안내</h3>
        <p className="mt-3 text-sm leading-relaxed text-warm-brown">
          이 앱의 명언은 OpenAI GPT API를 통해 생성됩니다. AI가 만든 위로는 참고용이며,
          전문적인 상담·치료를 대체하지 않습니다. 마음이 많이 힘들다면 주변의 전문가에게
          도움을 요청해 주세요.
        </p>
      </section>

      <section className="rounded-3xl border border-cream-dark bg-white/80 p-6 text-center">
        <h3 className="text-lg font-semibold text-warm-brown">개발</h3>
        <p className="mt-3 text-base text-warm-brown/80">{DEVELOPER_NAME}</p>
      </section>
    </div>
  )
}
