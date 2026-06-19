# Session 1 - 기술 분석 (Technical Analysis)

## 🔧 기술 스택 심층 분석

### Frontend Architecture

#### Next.js 16.2.4 특징
- **App Router** 사용 (Pages Router 아님)
- **React 19.2.4** - 최신 버전
- **Turbopack** 빌드 시스템
- **Server/Client Component 분리** 필수

#### 컴포넌트 구조
```
[Server] page.tsx
    └── [Client] Game.tsx (useGameLoop 훅 사용)
            ├── Canvas Rendering
            ├── Event Handling
            └── State Management
```

**주의사항**:
- 서버 컴포넌트에 이벤트 핸들러 불가
- `'use client'` 지시어 필수
- 이벤트는 클라이언트 훅에서 처리

---

## 🎨 렌더링 시스템 분석

### Canvas 렌더링 파이프라인

**렌더링 순서** (레이어링):
```
1. Background Gradient (그라데이션 배경)
2. Parallax Layers (산, 구름, 나무)
3. Sakura Petals (벚꽃 잎)
4. Game Objects (고양이, 장애물, 아이템)
5. UI Elements (하트, 점수)
6. Particles (하트 파티클)
7. Overlays (인트로, 게임오버)
```

### 픽셀 아트 시스템

**`drawPixelArt` 함수**:
```typescript
// 픽셀 단위로 스프라이트를 캔버스에 그리기
drawPixelArt(ctx, sprite, x, y, scale, alpha)
```

**특징**:
- ASCII 스타일 픽셀 데이터 배열
- 이모지로 색상 표현 (🟥, 🟨, ⬛ 등)
- 런타임 색상 매핑
- 스케일링 지원 (3x, 4x)
- 투명도 제어

**최적화**:
- `imageRendering: 'pixelated'` CSS 속성
- 정수 좌표 사용 (픽셀 완벽 정렬)

---

## ⚙️ 게임 로직 심층 분석

### 물리 엔진

**중력 시스템**:
```typescript
const GRAVITY = 1.0;           // 기본 중력
const GRAVITY_HOLD = 0.45;     // 점프키 유지 시
const JUMP_FORCE = -16;        // 초기 점프 속도
```

**가변 점프 메커니즘**:
- 짧게 누르기: 낮은 점프 (빠른 낙하)
- 길게 누르기: 높은 점프 (체공 시간 증가)
- 실시간 중력 전환 (`isHoldingJump` 플래그)

### 충돌 판정 알고리즘

**히트박스 계산**:
```typescript
// 고양이 히트박스 (패딩 적용)
catHitbox = {
  left: cat.x + 24,
  right: cat.x + cat.width - 24,
  top: cat.y + 15,
  bottom: cat.y + cat.height - 6
}

// 장애물 히트박스 (타입별 패딩)
obstacleHitbox = {
  left: ent.x + padding,
  right: ent.x + ent.width - padding,
  top: ent.y + padding,
  bottom: ent.y + ent.height
}
```

**차등 데미지 시스템**:
```typescript
// 충돌 면적 계산
overlap = (minRight - maxLeft) * (minBottom - maxTop)

// 대형 선인장
if (overlap > 1000) damage = 6
else if (overlap > ...) damage = 3

// 소형 선인장
if (overlap > 800) damage = 3
else if (overlap > 300) damage = 2
else damage = 1
```

**특징**:
- 픽셀 완벽 충돌 감지
- 면적 기반 데미지 계산
- 무적 프레임 (iframeTime = 60)

### 스폰 시스템

**동적 난이도 조정**:
```typescript
// 속도 증가 (점진적)
if (frameCount % 10 === 0) {
  score++;
  speed += 0.006;
}

// 스폰 간격 감소
baseInterval = max(35, 90 - floor(speed * 4))
nextSpawnTime = frameCount + baseInterval + random(30)
```

**확률 분포**:
- 80%: 소형 선인장
- 36%: 대형 선인장
- 20%: 츄르 (체력 회복)

---

## 🎵 오디오 아키텍처 분석

### Web Audio API 구조

**노드 그래프**:
```
[Oscillator] → [Gain] → [Filter] → [masterGain] → [Destination]
```

**Audio Manager** (`index.ts`):
```typescript
class AudioManager {
  - audioContext: AudioContext
  - masterGain: GainNode
  - muted: boolean
  
  methods:
  + init()              // 컨텍스트 초기화
  + startBgm()          // BGM 시작
  + fadeOutBgm(time)    // 페이드아웃
  + playJump()          // 점프 효과음
  + playDamage()        // 피격 효과음
  + playHeal()          // 회복 효과음
  + toggleMute()        // 음소거 토글
}
```

### BGM 시퀀서 분석

**트랙 구조**:
```typescript
tracks = {
  piano: [...notes],     // 메인 멜로디
  bass: [...notes],      // 베이스 라인
  pad: [...notes],       // 패드 사운드
  drums: [...notes],     // 드럼 비트
  strings: [...notes],   // 현악기
  glassy: [...notes]     // 유리 구슬 소리
}
```

**시퀀싱 로직**:
```typescript
// 76마디 * 4비트 = 304 스텝
// 100 BPM → 각 비트 = 0.6초
// 총 길이 = 304 * 0.6 = 182.4초 (3분 2초)

for each track:
  for each note at beatIndex:
    schedule note at time = beatIndex * beatDuration
```

**악기 합성**:
- **Piano**: Triangle wave + LPF (cutoff: 1200Hz)
- **Bass**: Sine wave (저음역)
- **Pad**: Triangle wave + Detune + LPF (800Hz)
- **Drums**: Noise burst (20ms)
- **Strings**: Sawtooth + LPF (600Hz)
- **Glassy**: Sine wave (고음역)

---

## 🌸 배경 시스템 분석

### Parallax Engine

**레이어 구조**:
```typescript
Layer {
  sprite: string[][]     // 픽셀 데이터
  y: number             // Y 위치
  speed: number         // 스크롤 속도 (0.05 ~ 0.4)
  instances: Instance[] // 화면에 그려질 인스턴스들
}
```

**스크롤 로직**:
```typescript
// 각 레이어마다 다른 속도로 스크롤
parallaxSpeed = gameSpeed * layer.speed

// 무한 스크롤 (wrap around)
if (instance.x + width < 0) {
  instance.x = canvas.width + gap
}
```

**레이어 설정**:
1. 산 (원거리) - 0.05x 속도
2. 구름 - 0.1x 속도
3. 벚꽃나무 (근거리) - 0.4x 속도

### Sakura Engine

**파티클 시스템**:
```typescript
Petal {
  x, y: number          // 위치
  vx, vy: number        // 속도
  rotSpeed: number      // 회전 속도
  wobble: number        // 흔들림
  color: string         // 색상 (밝기 변화)
}
```

**물리 시뮬레이션**:
- 중력: `vy += 0.05`
- 바람: `vx = sin(wobble) * 0.8`
- 회전: `angle += rotSpeed`
- 고양이 점프 시 속도 변화

---

## 🧠 오토파일럿 AI 분석

### 입력 버퍼 시스템

**키워드 감지**:
```typescript
inputBuffer = (inputBuffer + key).slice(-30).toLowerCase()

keywords = ['believe', '믿어', '믿는다', '난 널 믿어', ...]

if (keywords.some(kw => inputBuffer.includes(kw))) {
  activateAutopilot()
}
```

### AI 의사결정 알고리즘

**장애물 감지**:
```typescript
hazards = entities.filter(e => 
  e.type.includes('cactus') && 
  e.x > cat.x - 50
)
```

**점프 타이밍 계산**:
```typescript
nearest = hazards[0]
dist = nearest.x - (cat.x + 80)        // 고양이 앞부분 기준
timeToImpact = dist / speed            // 도달 시간

leadTime = 16 + (speed * 0.4)          // 속도에 따른 선행 시간

if (timeToImpact < leadTime && !isJumping) {
  jump()
}
```

**점프 홀드 최적화**:
```typescript
// 다음 장애물이 가까우면 점프 유지
if (futureHazard && futureHazard.x < landingX + 50) {
  holdJump = true
} else if (currentHazard still ahead) {
  holdJump = true
} else {
  releaseJump()
}
```

**특징**:
- 거리/속도 기반 예측
- 연속 장애물 대응
- 동적 선행 시간 조정

---

## 📱 모바일 지원 분석

### 터치 이벤트 처리

**이벤트 리스너**:
```typescript
window.addEventListener('touchstart', handleTouchStart, {
  passive: false  // preventDefault 가능
})
window.addEventListener('touchend', handleTouchEnd, {
  passive: false
})
```

**핸들러 로직**:
```typescript
handleTouchStart(e) {
  e.preventDefault()           // 스크롤 방지
  audioManager.init()          // 오디오 초기화
  
  if (!isStarted || isGameOver) {
    startGame()
  } else {
    jump()
  }
}

handleTouchEnd(e) {
  e.preventDefault()
  releaseJump()                // 가변 점프
}
```

### 반응형 UI

**가로/세로 감지**:
```typescript
isPortrait = (
  window.innerHeight > window.innerWidth && 
  window.innerWidth < 1024
)
```

**세로 모드 처리**:
- 전체 화면 경고 오버레이
- 가로 전환 안내 메시지
- 게임 플레이 차단

---

## 🎯 성능 최적화 분석

### 렌더링 최적화

**requestAnimationFrame 사용**:
- 브라우저 리프레시 레이트 동기화
- 60 FPS 타겟
- 백그라운드 시 자동 일시정지

**엔티티 필터링**:
```typescript
// 화면 밖 객체 제거
entities = entities.filter(ent => 
  ent.x + ent.width > 0 && ent.active
)
```

**파티클 정리**:
```typescript
// 투명도 0 도달 시 제거
heartParticles = heartParticles.filter(p => p.alpha > 0)
```

### 메모리 관리

**useRef 활용**:
- 리렌더링 없이 상태 업데이트
- 게임 루프 내 state 변경 최적화

**오디오 리소스**:
- 단일 AudioContext
- 노드 재사용
- 자동 가비지 컬렉션

---

## 🐛 알려진 이슈 및 제약사항

### 브라우저 호환성
- **Web Audio API**: 모든 모던 브라우저 지원
- **Canvas**: IE 제외 모든 브라우저
- **터치 이벤트**: 모바일 전용

### 성능 제약
- **픽셀 아트 스케일링**: GPU 가속 필요
- **파티클 시스템**: 많은 객체 시 성능 저하 가능
- **오디오 합성**: CPU 부하 (모바일 주의)

### Next.js 특이사항
- **Hot Reload**: 게임 상태 초기화됨
- **SSR**: Canvas는 클라이언트 전용
- **이벤트 핸들러**: 서버 컴포넌트 제약

---

## 📊 코드 메트릭스

### 파일 크기 (추정)
- `useGameLoop.ts`: ~600 lines (핵심 로직)
- `assets.ts`: ~400 lines (픽셀 데이터)
- `bgm.ts`: ~300 lines (음악 시퀀싱)
- `Game.tsx`: ~150 lines (UI)
- `audio/` 폴더: ~300 lines (효과음)

### 복잡도
- **물리 엔진**: 중간
- **충돌 판정**: 높음 (정밀)
- **오디오 합성**: 높음
- **AI 로직**: 중간
- **렌더링**: 중간

---

## 🔐 보안 고려사항

### XSS 방지
- 사용자 입력 없음 (키보드만)
- 외부 리소스 없음 (폰트 로컬)

### CSP (Content Security Policy)
- 인라인 스타일 사용
- Web Audio API 허용 필요

### 데이터 저장
- 현재: 없음 (세션만)
- 향후: localStorage (점수 저장 시)

---

**기술 분석 완료**: 아키텍처 및 구현 세부사항 파악 완료 ✓
