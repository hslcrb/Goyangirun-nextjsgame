# 고양이런 (Goyangirun) 🐈🌸

**크롬 공룡 스타일 핑크 픽셀 아트 런닝 게임**

감성적인 벚꽃 봄 테마와 3분 분량의 감미로운 BGM이 어우러진 웹 기반 러닝 게임입니다.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## 🎮 게임 소개

고해상도 픽셀 아트로 그려진 고양이가 선인장 장애물을 피하고 츄르를 먹으며 봄 벚꽃 길을 달립니다.
단순하지만 중독성 있는 게임플레이에 프루티거 에어로와 리미널 스페이스 감성이 담긴 음악이 더해져,
플레이 그 자체가 하나의 예술적 경험이 되도록 설계되었습니다.

### 주요 특징

- 🎨 **고퀄리티 픽셀 아트**: 꼬리를 살랑거리며 달리는 하얀 양말 고양이
- 🎵 **3분 감성 BGM**: Web Audio API로 직접 합성한 왕도 코드 진행 음악
- 💖 **세밀한 체력 시스템**: 충돌 면적 기반 부분 데미지 (1/3, 2/3, 1칸)
- 🌸 **벚꽃 테마**: 시차 스크롤 배경과 흩날리는 벚꽃 잎
- 🎭 **감성적 연출**: 게임 오버 시 페이드 아웃과 서정적 문구
- 📱 **모바일 지원**: 터치 컨트롤 및 반응형 디자인
- 🤫 **이스터 에그**: 특정 키워드로 오토파일럿 모드 활성화

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 20 이상
- npm, yarn, pnpm 또는 bun

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 게임을 플레이하세요.

---

## 🎯 게임 방법

### 기본 조작
- **스페이스바** / **↑ 화살표** / **화면 터치**: 점프
- **길게 누르기**: 높은 점프 (체공 시간 증가)
- **짧게 누르기**: 낮은 점프 (빠른 낙하)

### 게임 요소
- **선인장 (소형/대형)**: 피해야 할 장애물 (1~6 데미지)
- **츄르**: 먹으면 체력 +3 회복
- **하트**: 총 5개 (15 HP)

### 숨겨진 기능
게임 중 특정 키워드를 입력하면... 🤫
*(힌트: `believe`, `믿어`)*

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: [Next.js 16.2.4](https://nextjs.org) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Library**: [React 19.2.4](https://react.dev/)

### 게임 엔진
- **Graphics**: HTML5 Canvas API
- **Audio**: Web Audio API (주파수 합성)
- **Physics**: 커스텀 중력 및 충돌 엔진

### 특징적 기술
- 픽셀 완벽 충돌 판정
- 가변 점프 메커니즘
- 다층 시차 스크롤
- 실시간 오디오 시퀀싱
- 파티클 시스템

---

## 📁 프로젝트 구조

```
Goyangirun-nextjsgame/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── layout.tsx         # 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── components/
│   │   └── Game.tsx           # 게임 UI 컴포넌트
│   ├── hooks/
│   │   └── useGameLoop.ts     # 게임 로직 훅
│   └── utils/
│       ├── assets.ts          # 픽셀 아트 에셋
│       ├── audio/             # 오디오 시스템
│       │   ├── index.ts       # Audio Manager
│       │   ├── bgm.ts         # 배경 음악
│       │   ├── jump.ts        # 점프 효과음
│       │   ├── damage.ts      # 피격 효과음
│       │   └── heal.ts        # 회복 효과음
│       └── background/
│           └── sakura.ts      # 벚꽃 엔진
├── public/
│   └── fonts/                 # 로컬 폰트
├── docs/                      # 프로젝트 문서
└── _AGENTS_BRAIN_/            # 개발 세션 문서
```

---

## 🎨 아트워크

모든 픽셀 아트는 코드로 직접 작성되었으며, 에셋 파일 없이 순수 데이터로 구성됩니다.

### 캐릭터 스프라이트
- 달리기 애니메이션 (꼬리 흔들림)
- 웃는 표정 (츄르 먹을 때)
- 우는 표정 (피격 시)

### 배경 요소
- 원경 산맥
- 떠다니는 구름
- 벚꽃나무
- 흩날리는 벚꽃 잎

---

## 🎵 사운드 디자인

### BGM (배경 음악)
- **길이**: 3분 (76마디)
- **템포**: 100 BPM
- **코드 진행**: IV-V-iii-vi (Fmaj7-G7-Em7-Am7)
- **구조**: Verse → Pre-Chorus → Chorus → Fade-out
- **악기**: 피아노, 베이스, 패드, 드럼, 현악기, 글래시 신스
- **테마**: 프루티거 에어로 + 리미널 스페이스

### 효과음
- 점프: 뾰로롱 상승음
- 피격: 부서지는 소리
- 회복: 에너지 충전 아르페지오

모든 사운드는 Web Audio API로 실시간 합성됩니다.

---

## 🧩 게임 메커니즘

### 물리 시스템
```typescript
GRAVITY = 1.0           // 기본 중력
GRAVITY_HOLD = 0.45     // 점프키 유지 시
JUMP_FORCE = -16        // 초기 점프 속도
```

### 충돌 판정
- 픽셀 완벽 히트박스
- 충돌 면적 기반 차등 데미지
- 무적 프레임 (1초)

### 난이도 곡선
- 점수에 따른 점진적 속도 증가
- 동적 장애물 스폰 간격
- 확률 기반 아이템 등장

---

## 📝 개발 문서

상세한 개발 문서는 다음 디렉토리에서 확인할 수 있습니다:

- **`docs/`**: 구현 계획, 태스크, 워크스루
- **`_AGENTS_BRAIN_/s1/`**: 세션별 기술 분석 및 프로젝트 문서
  - `session_init.md`: 프로젝트 전체 개요
  - `technical_analysis.md`: 심층 기술 분석

---

## 🎓 기술적 하이라이트

### 고급 구현 사항
1. **오토파일럿 AI**: 거리/속도 기반 예측 점프 알고리즘
2. **레이어드 오디오**: 6트랙 동시 시퀀싱
3. **시차 스크롤**: 3단계 깊이감 있는 배경
4. **파티클 시스템**: 물리 기반 하트/벚꽃 파티클
5. **감성 연출**: 페이드 아웃 및 타이밍 기반 메시지

### 최적화
- requestAnimationFrame 기반 게임 루프
- useRef로 리렌더링 최소화
- 화면 밖 객체 자동 제거
- 오디오 노드 재사용

---

## 📱 모바일 지원

- ✅ 터치 이벤트 지원
- ✅ 반응형 캔버스
- ✅ 가로/세로 모드 감지
- ✅ 스크롤 및 줌 방지
- ✅ 텍스트 선택 차단

---

## 🚢 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

자세한 내용은 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)을 참고하세요.

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트이며, 코드와 아트워크는 자유롭게 참고하실 수 있습니다.

### 폰트 라이선스
- **OneStoreMobilePop**: [원스토어 모바일팝 폰트](https://noonnu.cc/font_page/709)

---

## 🙏 크레딧

- **음악 이론**: Royal Road 코드 진행 (IV-V-iii-vi)
- **디자인 영감**: 크롬 공룡 게임, 프루티거 에어로, 리미널 스페이스
- **개발 도구**: Next.js, TypeScript, Tailwind CSS

---

## 📞 연락처

프로젝트에 대한 문의나 제안은 이슈 탭을 통해 남겨주세요.

---

**즐거운 플레이 되세요! 🐈💖🌸**
