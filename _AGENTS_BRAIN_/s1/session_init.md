# Session 1 - 프로젝트 분석 및 초기화

**세션 시작 시간**: 2026-06-19  
**세션 목표**: Goyangirun Next.js 게임 프로젝트의 전체 구조 분석 및 현재 상태 파악

---

## 📋 프로젝트 개요

### 프로젝트명
**고양이런 (Goyangirun)** - 핑크 테마 픽셀 아트 런닝 게임

### 기술 스택
- **Framework**: Next.js 16.2.4 (React 19.2.4)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Runtime**: Node.js (via NVM)
- **Graphics**: HTML5 Canvas API
- **Audio**: Web Audio API (주파수 합성)

### 프로젝트 설명
크롬 공룡 게임 스타일의 횡스크롤 러닝 게임. 픽셀 아트로 디자인된 고양이가 선인장 장애물을 피하고 츄르를 먹으며 달리는 게임. 감성적인 벚꽃 봄 테마와 3분 분량의 감미로운 BGM이 특징.

---

## 🏗️ 프로젝트 구조 분석

### 디렉토리 구조
```
Goyangirun-nextjsgame/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 메인 페이지 (서버 컴포넌트)
│   │   ├── layout.tsx         # 레이아웃
│   │   ├── globals.css        # 전역 스타일 (OneStoreMobilePop 폰트)
│   │   └── favicon.ico
│   ├── components/
│   │   └── Game.tsx           # 메인 게임 UI 컴포넌트
│   ├── hooks/
│   │   └── useGameLoop.ts     # 게임 로직 훅 (물리, 충돌, 렌더링)
│   └── utils/
│       ├── assets.ts          # 픽셀 아트 에셋 (고양이, 장애물, UI)
│       ├── audio/
│       │   ├── index.ts       # Audio Manager
│       │   ├── bgm.ts         # 3분 BGM (프루티거 에어로)
│       │   ├── jump.ts        # 점프 효과음
│       │   ├── damage.ts      # 피격 효과음
│       │   └── heal.ts        # 회복 효과음
│       └── background/
│           └── sakura.ts      # 벚꽃, 시차 스크롤 엔진
├── public/
│   └── fonts/
│       └── ONE-Mobile-POP.woff
├── docs/
│   ├── implementation_plan.md  # 구현 계획서
│   ├── task.md                # 태스크 리스트
│   ├── walkthrough.md         # 상세 구현 내역
│   └── chat.md                # 대화 로그
├── _AGENTS_BRAIN_/            # 에이전트 세션 문서
├── AGENTS.md                  # Next.js 에이전트 규칙
└── CLAUDE.md
```

---

## 🎮 핵심 기능 분석

### 1. 게임 메커니즘
- **물리 시스템**: 중력, 가변 점프 높이 (GRAVITY, GRAVITY_HOLD)
- **충돌 판정**: 정밀한 픽셀 단위 히트박스 (부위별 차등 데미지)
- **체력 시스템**: 하트 5개 (15HP), 부분 데미지 (1/3, 2/3, 1칸)
- **무적 프레임**: 피격 후 1초간 깜빡이며 무적
- **스코어링**: 프레임 기반 점수 시스템

### 2. 캐릭터 & 애니메이션
**고양이 스프라이트** (고해상도 픽셀 아트):
- `CAT_RUN_1`, `CAT_RUN_2`: 달리기 (꼬리 흔들림)
- `CAT_SMILE_1`, `CAT_SMILE_2`: 츄르 먹을 때 웃는 표정
- `CAT_CRY`: 피격 시 우는 표정

**특징**:
- 옆모습 + 정면 얼굴 조합
- 하얀 양말 디테일
- 살랑살랑 움직이는 꼬리

### 3. 장애물 & 아이템
- **선인장 (소형)**: 기본 장애물 (1-3 데미지)
- **선인장 (대형)**: 큰 장애물 (3-6 데미지)
- **츄르**: 체력 회복 아이템 (+3 HP)

### 4. 오디오 시스템
**Web Audio API 주파수 합성**:

**BGM** (`bgm.ts`):
- 3분 분량의 감성 음악
- 코드 진행: IV-V-iii-vi (Fmaj7-G7-Em7-Am7)
- 레이어드 구조: 피아노 → 비트 → 현악기 → 페이드아웃
- 프루티거 에어로 + 리미널 스페이스 감성
- 100 BPM, 76마디 시퀀싱

**효과음**:
- `jump.ts`: 뾰로롱 점프 사운드
- `damage.ts`: 피격 시 부서지는 소리
- `heal.ts`: 츄르 먹을 때 상승 아르페지오

### 5. 시각 효과
- **배경**: 시차 스크롤 (산, 구름, 벚꽃나무)
- **벚꽃 엔진**: 흩날리는 벚꽃 잎 파티클
- **하트 파티클**: 피격 시 떨어지는 하트 조각
- **게임 오버 연출**: 1.5초 페이드 아웃 (화면 + 음악)
- **감성 문구**: "그곳에 더 이상의 봄은 없었습니다."

### 6. UI/UX
- **폰트**: OneStoreMobilePop (로컬 다운로드)
- **반응형**: 모바일 세로 모드 시 가로 전환 안내
- **터치 컨트롤**: 화면 터치로 점프
- **음소거 버튼**: 우측 상단 토글
- **드래그/선택 방지**: 전역 텍스트 선택 차단

### 7. 숨겨진 기능 (이스터 에그)
**오토파일럿 모드**:
- 키워드 입력: `believe`, `믿어`, `믿는다` 등
- 자동 점프 AI (장애물 거리 계산)
- 활성화 메시지: "누군가 나를 믿어준다는 것."
- 게임 오버 시 초기화

---

## 📊 현재 프로젝트 상태

### 완성된 기능 ✅
- [x] 기본 게임 루프 (60 FPS)
- [x] 고해상도 픽셀 아트 캐릭터
- [x] 정밀 충돌 판정 시스템
- [x] 세분화된 체력 시스템 (부분 데미지)
- [x] 3분 감성 BGM (Web Audio API)
- [x] 모든 효과음 (주파수 합성)
- [x] 벚꽃 배경 및 시차 스크롤
- [x] 게임 오버 페이드 아웃 연출
- [x] 모바일 터치 지원
- [x] 오토파일럿 이스터 에그
- [x] 폰트 커스터마이징

### Git 커밋 히스토리 요약
```
feat: implement Cat Run game with pink theme, fractional health, and Web Audio API
feat: add large cactus, healing mouse item, and variable jump height
style: apply OneStoreMobilePop font globally and locally download font file
feat: add crying cat expression when taking damage
feat: disable text selection and right click globally
fix: move drag and contextmenu blockers to client side hook
style: 길쭉하고 꼬리가 움직이는 옆모습 고양이 픽셀아트로 변경 및 충돌 판정 개선
feat: 체력 회복 아이템을 생쥐에서 츄르로 변경하고 기뻐하는 고양이 표정 추가
feat: 고해상도 고양이 픽셀 아트 적용 및 오디오 시스템 모듈 리팩토링
feat: 감미로운 벚꽃 테마 BGM(Royal Road 진행) 및 다성부 시퀀서 구현
feat: 3분 분량의 레이어드 감성 BGM(프루티거 에어로 & 리미널 스페이스) 및 현악기 합성 엔진 구현
feat: 서정적인 게임 오버 연출(암전 및 오디오 페이드) 구현
```

---

## 🎯 특이사항 및 주의점

### Next.js 관련
- **버전**: Next.js 16.2.4 (최신, breaking changes 가능성)
- **규칙**: `AGENTS.md` 참조 - 구버전과 다를 수 있음
- **서버/클라이언트 분리**: 이벤트 핸들러는 클라이언트에서만

### 게임 로직
- **FPS**: 고정 60 FPS
- **물리 상수**: GRAVITY=1.0, GRAVITY_HOLD=0.45, JUMP_FORCE=-16
- **스폰 주기**: 점수에 따라 동적 조정
- **난이도**: 속도가 점진적으로 증가 (speed += 0.006)

### 오디오
- **초기화**: 사용자 인터랙션 후 시작 (브라우저 정책)
- **BGM**: 3분 루프, 페이드 아웃 1.5초
- **합성**: Triangle wave, Sawtooth, LPF 사용

### 스타일링
- **테마**: 핑크 파스텔 (벚꽃 봄 테마)
- **픽셀 렌더링**: `imageRendering: 'pixelated'`
- **폰트**: 로컬 `.woff` 파일 사용

---

## 📝 문서화 상태

### 기존 문서
- `implementation_plan.md`: 모바일 최적화 계획 (미완성)
- `task.md`: 이스터 에그 체크리스트
- `walkthrough.md`: 이스터 에그 구현 가이드
- `chat.md`: 전체 개발 대화 로그 (상세)

### 추가 필요 문서
- API 문서
- 컴포넌트 구조도
- 게임 밸런스 가이드
- 배포 가이드

---

## 🚀 다음 단계 제안

### 잠재적 개선 사항
1. **모바일 최적화 완성**
   - 터치 컨트롤 개선
   - 반응형 캔버스 사이즈
   - 성능 최적화

2. **콘텐츠 확장**
   - 추가 장애물/아이템
   - 스테이지 시스템
   - 랭킹/점수 저장

3. **시각 효과 강화**
   - 더 많은 배경 레이어
   - 날씨 효과
   - 파티클 시스템 확장

4. **배포 준비**
   - Vercel 배포 설정
   - SEO 최적화
   - PWA 변환

---

## 🔗 주요 파일 레퍼런스

### 코어 로직
- `src/hooks/useGameLoop.ts` (500+ lines) - 게임 메인 로직
- `src/utils/assets.ts` - 모든 픽셀 아트 데이터

### 오디오
- `src/utils/audio/bgm.ts` - BGM 시퀀서
- `src/utils/audio/index.ts` - Audio Manager

### UI
- `src/components/Game.tsx` - 게임 컴포넌트
- `src/app/globals.css` - 전역 스타일

---

**세션 초기화 완료**: 프로젝트 전체 구조 파악 완료 ✓
