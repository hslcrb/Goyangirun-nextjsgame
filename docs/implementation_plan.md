# Cat Run (고양이런) Implementation Plan

Next.js를 기반으로 크롬 공룡 게임(Chrome Dinosaur Game) 스타일의 가로 횡스크롤 런닝 게임을 제작하기 위한 계획입니다. 픽셀 스타일의 고양이 캐릭터를 직접 구현하고, 장애물을 피하며 점수를 얻는 게임을 개발합니다.

## User Review Required

> [!IMPORTANT]
> - 현재 시스템에 Node.js가 설정되어 있지 않아 NVM을 통해 Node.js(LTS버전)를 먼저 설치하고 진행할 예정입니다.
> - 게임 성능 향상과 자연스러운 애니메이션을 위해 HTML5 `<canvas>`와 `requestAnimationFrame`을 이용해 게임 루프를 구현할 계획입니다.
> - 디자인 측면에서 고양이(플레이어)와 장애물 등은 픽셀 아트를 데이터(base64 또는 하드코딩된 픽셀 맵)로 직접 만들어 렌더링하겠습니다.

## Proposed Changes

---

### Environment Setup

#### [NEW] [nvm and node setup](env)
NVM을 통해 Node.js LTS 버전을 설치합니다.

#### [NEW] [Next.js Project 셋업](npx)
`npx create-next-app`을 활용하여 새로운 Next.js 프로젝트를 초기화합니다. (TypeScript, Tailwind CSS 적용)

---

### Game Components & Assets

#### [NEW] [src/components/Game.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/components/Game.tsx)
실제 게임 화면을 렌더링하는 컴포넌트입니다. `<canvas>` 엘리먼트를 포함하고 게임 루프를 실행합니다.

#### [NEW] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
`requestAnimationFrame`을 사용하여 60FPS의 게임 프레임과 충돌 판정, 오브젝트 이동, 점수 계산을 담당하는 커스텀 훅입니다.

#### [NEW] [src/utils/assets.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/assets.ts)
픽셀 하드코딩 아트를 구현합니다. 고양이 스프라이트(달리기, 점프) 및 장애물 스프라이트를 색상 배열 혹은 Base64 형태로 제공합니다.

---

### Pages

#### [MODIFY] [src/app/page.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/app/page.tsx)
기본 Next.js 페이지를 수정하여 화면에 꽉 차게 게임 컴포넌트가 가로로 길게 렌더링되도록 디자인합니다. 타이틀 "고양이런" 및 게임 오버/시작 UI를 적용합니다.

## Open Questions

> [!NOTE]
> 1. 장애물로 어떤 것을 선호하시나요? (예: 선인장, 강아지, 빈 박스 등)
> 2. 배경화면도 픽셀 느낌의 구름 등으로 꾸며드릴까요, 아니면 깔끔하게 캐릭터와 배경(땅)만 둘까요?

## Verification Plan

### Automated/Manual Verification
- Next.js 개발 서버(`npm run dev`)를 실행.
- 브라우저를 통해 점프 메커니즘과 충돌 로직이 정상적으로 작동하는지 확인.
- 애니메이션과 픽셀 그래픽이 잘 표시되는지 직접 테스트하여 확인.
