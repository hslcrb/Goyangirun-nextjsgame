# 그래픽 정교화 및 오디오 리팩토링 계획

고양이런의 그래픽 퀄리티를 한 단계 끌어올리고 오디오 구조를 개선하기 위한 상세 계획입니다.

## User Review Required

> [!IMPORTANT]
> 1. **픽셀 정교화 (고해상도화)**: 기존의 큰 네모 네모(블록 1개당 4x4) 느낌에서 벗어나, 픽셀 단위 크기(`PIXEL_SIZE`)를 2로 줄이고 **픽셀 배열 데이터의 크기(해상도)를 가로세로 약 2배로 늘려서** 훨씬 부드럽고 디테일한 모습의 고양이와 츄르를 다시 그리겠습니다.
> 2. **오디오 모듈 분리**: 현재 하나의 `audio.ts`에 몰려있는 코드를 `src/utils/audio/` 폴더 하위에 역할별로(`bgm.ts`, `jump.ts`, `damage.ts`, `heal.ts`) 철저하게 분리하겠습니다. 이렇게 두면 나중에 소리를 관리하기가 훨씬 깔끔합니다. 

## Proposed Changes

---

### 1. 픽셀 고해상도 그래픽 적용 & 웃음 애니메이션

#### [MODIFY] [src/utils/assets.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/assets.ts)
- `CAT_RUN_1`, `CAT_RUN_2`: 크기를 가로 약 50칸, 세로 약 20칸 수준으로 확장하여 다리와 얼굴, 꼬리의 굴곡을 더 정교하게(둥글게) 다듬습니다.
- `CAT_JUMP`, `CAT_CRY`: 확장된 해상도에 맞게 다시 디자인합니다.
- `CAT_SMILE_1`, `CAT_SMILE_2` **[NEW]**: 츄르를 먹었을 때 가만히 웃는 것이 아니라, **귀엽게 웃으면서 꼬리를 살랑이는 모션(2프레임 애니메이션)**을 추가합니다.
- `ITEM_CHURU`: 츄르 포지 역시 더 디테일하게, 짜먹는 튜브 형태가 선명하게 보이도록 고해상도화 합니다.

### 2. 물리 렌더링 스케일 변경

#### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- `PIXEL_SIZE` = 4 에서 **`PIXEL_SIZE` = 2** 로 변경하여, 화면에서 차지하는 부피감은 유사하게 유지하되 픽셀 밀도를 높입니다.
- 웃음 상태(`smileTime > 0`)일 때도 프레임(`frameCount % 20 < 10`)에 따라 `CAT_SMILE_1`과 `CAT_SMILE_2`를 번갈아가며 화면에 리페인트(애니메이션)시킵니다.
- 고해상도화 됨에 따라 달라진 너비/높이에 맞춰서 `Hitbox` 충돌 패딩 로직을 정교하게 다듬어 억울한 충돌이 없도록 합니다.

### 3. 오디오 구조 리팩토링 및 효과음 강화

#### [NEW] `src/utils/audio/index.ts` (모듈 총괄 관리)
#### [NEW] `src/utils/audio/bgm.ts`
#### [NEW] `src/utils/audio/jump.ts`
#### [NEW] `src/utils/audio/damage.ts`
#### [NEW] `src/utils/audio/heal.ts`
- Web Audio API 로직을 각각의 파일로 완전히 분산시켜 모놀리틱 패턴을 해소합니다.
- **에너지 채워지는 치유 효과음**: 띠로링~ 정도가 아니라 **파라라락-뾰롱!** 하면서 차오르는 듯한 아르페지오 신스(Synth) 음향으로 `heal.ts` 로직을 짜서 더 극적인 피드백을 주겠습니다.

## Open Questions

> [!NOTE]
> 1. 오디오 모듈 분리 시 객체지향적인 `Class` 형태를 각 파일이 담당하게 할까요? 아니면 단순히 기능만 하는 `function` 모음집 구조로 가져갈까요? (함수 단위 조합 방식이 React와 잘 어울려 추천합니다.)
> 2. 고양이의 새로운 고해상도 버전을 그릴 때, 포인트 컬러(하얀 양말을 신은 다리 등)를 조금 더 섞어서 묘사력을 높이는 건 어떨까요?

## Verification Plan
1. 새로운 고양이와 츄르의 도트가 촘촘하고 예쁘게 보이는지 화면에서 바로 확인 (렌더링 에러가 가장 주요 검증대상).
2. 츄르를 먹었을 때 두 손을 들고 꼬리를 살랑살랑 하며 웃는 애니메이션 재생 여부 확인.
3. 츄르를 먹었을 때 사운드가 극적인 힐링(`energy fill up` 느낌) 사운드로 나오는지 청각 테스트.
