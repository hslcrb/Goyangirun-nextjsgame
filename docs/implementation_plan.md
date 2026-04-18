# 봄의 정취: 사실적인 벚꽃 배경 및 파티클 시스템 구현 계획

고양이가 달리는 핑크빛 세상에 봄의 생동감과 서정성을 더하기 위해, 사실적으로 흩날리는 벚꽃 잎과 원근감이 느껴지는 배경 요소를 추가합니다.

## User Review Required

> [!IMPORTANT]
> 1. **사실적인 벚꽃 잎 (Petal Particles)**: 단순히 떨어지는 것이 아니라, 바람에 흔들리며(Sine wave), 회전하고, 때로는 화면 앞뒤로 지나가는 듯한 입체적인 파티클 시스템을 구현합니다.
> 2. **패럴랙스 배경 (Parallax Layers)**: 먼 산, 벚꽃 나무, 그리고 가까운 배경 요소를 분리하여 고양이가 달릴 때 깊이감이 느껴지도록 층별로 속도를 다르게 배치합니다.
> 3. **성능 최적화**: 수많은 잎사귀가 날려도 프레임 드랍이 없도록 오프스크린 렌더링이나 정적 파티클 풀링 기법을 고려합니다.

## Proposed Changes

### [NEW] [src/utils/background/sakura.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/background/sakura.ts)
- `SakuraParticle` 클래스 또는 인터페이스 정의.
- 바람의 세기(Wind intensity)와 중력에 따른 입자 궤적 연산 로직.
- 벚꽃 잎 특유의 하트 모양 픽셀 아트 데이터 포함.

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- 게임 루프의 `draw` 단계 시작 시점에 `drawSakuraBackground` 호출 추가.
- 배경 레이어(먼 배경, 중간 배경) 관리 상태 추가.

### [MODIFY] [src/utils/assets.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/assets.ts)
- 벚꽃 잎, 먼 산, 뭉게구름 등 봄 테마를 위한 추가 픽셀 아트 에셋 정의.

## Open Questions

> [!NOTE]
> 1. **상호작용**: 고양이가 점프하거나 빠르게 달릴 때 벚꽃 잎이 고양이 주변에서 소용돌이치거나 뒤로 밀려나는 효과를 추가하면 더욱 사실적일 것 같습니다. 이 정도의 디테일까지 구현할까요?
> 2. **배경 구성**: 벚꽃 나무가 직접 고양이 뒤를 지나가게 할까요, 아니면 먼 곳에 숲처럼 표현할까요?

## Verification Plan

### Automated Tests
- `npm run dev` 실행 후 60FPS가 안정적으로 유지되는지 성능 모니터링.

### Manual Verification
- 벚꽃 잎의 움직임이 단순하지 않고 '사실적이며 서정적으로' 느껴지는지 확인.
- 패럴랙스 효과가 어색하지 않게(먼 배경이 더 천천히 움직이게) 적용되었는지 확인.
