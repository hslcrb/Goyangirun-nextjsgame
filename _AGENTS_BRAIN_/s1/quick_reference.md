# Session 1 - Quick Reference Guide

**빠른 참조를 위한 핵심 정보 요약**

---

## 🚀 프로젝트 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 열기
# http://localhost:3000
```

---

## 📁 핵심 파일 위치

| 파일 | 경로 | 설명 |
|------|------|------|
| 게임 로직 | `src/hooks/useGameLoop.ts` | 메인 게임 루프 (500+ lines) |
| UI 컴포넌트 | `src/components/Game.tsx` | 게임 화면 UI |
| 픽셀 아트 | `src/utils/assets.ts` | 모든 스프라이트 데이터 |
| BGM | `src/utils/audio/bgm.ts` | 3분 배경음악 |
| 오디오 매니저 | `src/utils/audio/index.ts` | 사운드 제어 |
| 배경 엔진 | `src/utils/background/sakura.ts` | 시차 스크롤 + 벚꽃 |
| 전역 스타일 | `src/app/globals.css` | CSS + 폰트 |
| 메인 페이지 | `src/app/page.tsx` | Next.js 엔트리 |

---

## 🎮 게임 상수

### 물리
```typescript
GRAVITY = 1.0
GRAVITY_HOLD = 0.45
JUMP_FORCE = -16
FPS = 60
```

### 체력
```typescript
MAX_HP = 15
MAX_HEARTS = 5
HP_PER_HEART = 3
```

### 캔버스
```typescript
WIDTH = 800
HEIGHT = 300
PIXEL_SIZE = 3
GROUND_Y = 280
```

---

## 🎨 스프라이트 키

### 고양이
- `CAT_RUN_1`, `CAT_RUN_2` - 달리기
- `CAT_SMILE_1`, `CAT_SMILE_2` - 웃음
- `CAT_CRY` - 울음

### 장애물
- `OBSTACLE_CACTUS` - 소형 선인장
- `OBSTACLE_CACTUS_LARGE` - 대형 선인장

### 아이템
- `ITEM_CHURU` - 츄르 (회복)

### UI
- `HEART_FULL` - 꽉 찬 하트
- `HEART_PARTIAL` - 부분 하트
- `HEART_EMPTY` - 빈 하트

---

## 🎵 오디오 함수

```typescript
audioManager.init()              // 오디오 컨텍스트 초기화
audioManager.startBgm()          // BGM 재생
audioManager.fadeOutBgm(1.5)    // 1.5초 페이드 아웃
audioManager.playJump()          // 점프 소리
audioManager.playDamage()        // 피격 소리
audioManager.playHeal()          // 회복 소리
audioManager.toggleMute()        // 음소거 토글
```

---

## 🔧 주요 함수

### 게임 제어
```typescript
startGame()     // 게임 시작/재시작
jump()          // 점프 시작
releaseJump()   // 점프 키 해제
```

### 렌더링
```typescript
drawPixelArt(ctx, sprite, x, y, scale, alpha)
getHeartSprite(full, partial)
```

### 스폰
```typescript
// 자동 호출 - 조정 불필요
// frameCount >= nextSpawnTime 시 자동 스폰
```

---

## 🐛 디버그 팁

### 충돌 판정 보기
```typescript
// useGameLoop.ts 내부
// 히트박스 그리기 (디버그용)
ctx.strokeStyle = 'red';
ctx.strokeRect(catHitbox.left, catHitbox.top, 
  catHitbox.right - catHitbox.left, 
  catHitbox.bottom - catHitbox.top);
```

### 프레임률 확인
```typescript
console.log('FPS:', 1000 / (performance.now() - lastFrameTime));
```

### 스폰 간격 조정
```typescript
// useGameLoop.ts
const baseInterval = Math.max(35, 90 - Math.floor(s.speed * 4));
// 35를 낮추면 더 자주 스폰
```

---

## 🎯 이스터 에그

### 오토파일럿 활성화
게임 중 다음 키워드 입력:
- `believe`
- `믿어`
- `믿는다`
- `난 널 믿어`
- `난널믿어`
- `널 믿는다`

### 메시지
"누군가 나를 믿어준다는 것."

---

## 🔑 환경 변수 (필요 시)

현재는 사용하지 않지만, 향후 추가 가능:

```env
# .env.local
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GA_ID=
DATABASE_URL=
```

---

## 📦 의존성

### 프로덕션
```json
{
  "next": "16.2.4",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

### 개발
```json
{
  "typescript": "^5",
  "tailwindcss": "^4",
  "eslint": "^9"
}
```

---

## 🎨 색상 팔레트

### 핑크 테마
```css
/* Primary */
--pink-50: #FFF5F5
--pink-100: #FFE4E1
--pink-200: #FFC0CB
--pink-300: #FFB6C1
--pink-400: #FF69B4
--pink-500: #FF1493

/* Background */
--misty-rose: #FFE4E1
--lavender-blush: #FFF5F5

/* UI */
--white: #FFFFFF
--black: rgba(0, 0, 0, 0.95)
```

---

## 🖱️ 이벤트 핸들러

### 키보드
```typescript
'keydown' -> handleKeyDown
  - Space/ArrowUp: jump() 또는 startGame()
  - 문자 키: inputBuffer 업데이트 (이스터 에그)

'keyup' -> handleKeyUp
  - Space/ArrowUp: releaseJump()
```

### 터치
```typescript
'touchstart' -> handleTouchStart
  - jump() 또는 startGame()
  - preventDefault() (스크롤 방지)

'touchend' -> handleTouchEnd
  - releaseJump()
```

### 마우스
```typescript
canvas.onMouseDown -> jump() 또는 startGame()
canvas.onMouseUp -> releaseJump()
```

---

## 📊 게임 밸런스

### 데미지
| 장애물 | 면적 | 데미지 |
|--------|------|--------|
| 소형 선인장 | > 800 | 3 |
| 소형 선인장 | 300-800 | 2 |
| 소형 선인장 | < 300 | 1 |
| 대형 선인장 | > 1000 | 6 |
| 대형 선인장 | < 1000 | 3 |

### 회복
- 츄르: +3 HP (최대 15)

### 난이도
```typescript
// 10프레임마다
score += 1
speed += 0.006

// 스폰 간격
baseInterval = max(35, 90 - floor(speed * 4))
```

---

## 🧪 테스트 시나리오

### 기본 플레이
1. 게임 시작
2. 소형 선인장 점프
3. 대형 선인장 점프
4. 츄르 획득
5. 게임 오버

### 이스터 에그
1. 게임 시작
2. `believe` 타이핑
3. 오토파일럿 활성화 확인
4. AI 자동 플레이 관찰

### 모바일
1. 모바일 기기 접속
2. 세로 모드 경고 확인
3. 가로 모드 전환
4. 터치 점프 테스트
5. 소리 토글 테스트

---

## 🚨 알려진 이슈

### 현재 없음 ✅

### 과거 해결된 이슈
- ✅ 서버 컴포넌트 이벤트 핸들러 에러
- ✅ 텍스트 선택 문제
- ✅ 게임 오버 팝업 제거
- ✅ 암전 효과 구현

---

## 📞 빠른 명령어

```bash
# 개발
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint

# 타입 체크
npx tsc --noEmit

# Git 커밋 (한글 메시지 규칙)
git add .
git commit -m "feat: 설명"
```

---

## 🔗 유용한 링크

- [Next.js Docs](https://nextjs.org/docs)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 자주 하는 작업

### 새 스프라이트 추가
1. `src/utils/assets.ts`에 픽셀 데이터 추가
2. export 키워드로 내보내기
3. `useGameLoop.ts`에서 import
4. 렌더링 로직에 추가

### 새 효과음 추가
1. `src/utils/audio/` 폴더에 새 파일 생성
2. 오실레이터 함수 작성
3. `index.ts`에서 export
4. 필요한 곳에서 호출

### 난이도 조정
```typescript
// useGameLoop.ts
s.speed += 0.006  // 이 값을 조정
// 높이면 더 빠르게 어려워짐
```

### 체력 밸런스 조정
```typescript
const s = state.current;
s.hp = 15;  // 초기 체력
// 츄르 회복량: +3
// 데미지: 1~6
```

---

**빠른 참조 가이드 끝**

더 자세한 내용은 다른 세션 문서를 참고하세요.
