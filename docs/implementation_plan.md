# Cat Run: Pink Cute & Advanced Features Update

기존의 단순했던 고양이런을 매우 귀엽고 디테일한(핑크테마, 체력 세분화, 주파수 사운드) 게임으로 대규모 개편하기 위한 전체적인 계획입니다.

## User Review Required

> [!IMPORTANT]
> 1. **Web Audio API**: 배경음악(BGM)과 효과음(점프, 피격음 등)을 Mp3가 아닌 코드(주파수 Oscillator)로 직접 작곡합니다. 브라우저 정책상 **사용자가 화면을 한 번 클릭하거나 조작(상호작용)한 이후에만 소리가 재생**될 수 있으므로, 시작 시 "소리 켜기 / 시작" 버튼 단계를 하나 두겠습니다.
> 2. **체력 및 부분 데미지 시스템**: 하트 5개(총 체력)가 있으며, 충돌 범위(선인장에 얼마나 깊숙이 부딪혔는가)를 정밀하게 계산하여 스친 정도면 하트의 1/3만 깎이고, 깊게 박히면 1개 전체 혹은 그 이상 깎이도록 로직을 추가합니다.
> 3. **무적 시간**: 장애물 통과 시 연속 데미지를 막기 위해 한 번 부딪히면 약 1~2초간 캐릭터가 깜빡이며 피해를 입지 않는(무적) 시간을 부여할 계획입니다. 동의하시나요?

## Proposed Changes

---

### 1. Theme and Assets Refactoring (핑크테마 & 애니메이션)

#### [MODIFY] [src/utils/assets.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/assets.ts)
- 전반적인 색상표(`COLORS`)를 핑크 스카이, 파스텔 핑크, 코랄 등으로 변경합니다.
- 고양이가 점프할 때의 아주 귀여운 모습(예: 만세 포즈 고양이, 혹은 윙크하는 모습)의 픽셀 데이터 `CAT_JUMP`를 새롭게 추가합니다.
- 하트 아이콘(꽉 찬 하트, 2/3 하트, 1/3 하트, 빈 하트) 픽셀 데이터를 추가해 화면에 그릴 수 있도록 합니다.

---

### 2. Audio Synthesis Engine

#### [NEW] [src/utils/audio.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/audio.ts)
- `AudioContext`를 활용한 커스텀 오디오 모듈을 작성합니다.
- **BGM**: 8비트 레트로 풍의 귀엽고 통통 튀는 멜로디 시퀀서를 배열(주파수 & 박자)로 코딩하여 무한 반복 재생시킵니다.
- **SFX**: 
  - `playJumpSound()`: 올라가는 주파수.
  - `playDamageSound()`: 찌그러지는 듯한(노이즈 섞인) 하락 주파수.
  - `playHeartDropSound()`: 하트가 떨어질 때 나는 아쉬운 뾰로롱 소리.

---

### 3. Game Logic Update (Health & Hitboxes)

#### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- 기존 단판 게임오버 로직 제거 및 **HP 시스템** (최대치 15 = 하트 5개 * 3조각) 도입.
- **정밀 충돌 판정**: `AABB`(Axis-Aligned Bounding Box) 충돌 중 겹친(Overlap) 면적을 계산해 작으면 1데미지(1/3), 중간이면 2데미지(2/3), 크면 3데미지(1개 분량)로 차등 삭감 반영합니다.
- 데미지를 입었을 때 **무적 프레임(Invincibility Frame)** 처리를 추가 (고양이가 반투명하게 깜빡임).
- 하트의 잔해가 떨어지는 파티클 요소(애니메이션 상태)를 루프 계산에 추가.

---

### 4. UI 및 렌더링 업데이트

#### [MODIFY] [src/components/Game.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/components/Game.tsx)
- 컨테이너와 배경 색상을 따뜻한 파스텔 핑크(`bg-pink-100`, 테두리는 `border-pink-300`)로 수정.
- 화면 상단에 캔버스를 통해 그려질 부분과 리액트 컴포넌트로 관리할 UI 영역 분리 (하트 조각 떨어지는 애니메이션을 리액트 스프링 이나 순수 CSS 애니메이션, 또는 캔버스 상 파티클로 표현).

## Open Questions

> [!NOTE]
> 1. 오디오 소리 볼륨이 시끄러울 수 있으므로 게임 내에 음소거 버튼을 추가하는 게 어떨까요?
> 2. 하트를 깎아먹기만 하는게 아니라, 필드에 가끔 나오는 하트 아이템을 먹으면 회복하는 요소도 추가할까요 아니면 피하기에만 집중하도록 할까요?

## Verification Plan
1. 개발 환경(`npm run dev`)에서 게임 시작.
2. 스페이스바 클릭 시 BGM이 켜지고, 점프 시 효과음 확인.
3. 캐릭터 점프 시 픽셀 모습(JUMP 액션 컷) 변경되는지 확인.
4. 살짝 스쳤을 때 하트 1/3 소모, 정면 충돌 시 더 많은 하트 소모 및 일정 시간 무적, 그리고 하트가 뿅뿅 하며 사라지는 모션 확인.
