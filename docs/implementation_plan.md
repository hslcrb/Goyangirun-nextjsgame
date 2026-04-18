# 이스터 에그: '믿음'의 오토파일럿 활성화 계획

사용자가 '믿음'과 관련된 특정 키워드를 입력하면, 고양이가 자동으로 선인장을 피하는 '오토파일럿 모드'를 활성화하고 감성적인 문구를 출력합니다.

## User Review Required

> [!IMPORTANT]
> 1. **트리거 키워드**: `Believe`, `believe`, `난 널 믿어`, `난널믿어`, `믿어`, `널 믿는다`, `믿는다`.
> 2. **오토파일럿 동작**: 활성화 시 고양이가 다가오는 선인장의 거리를 계산하여 자동으로 점프합니다. (체력이 0이 되기 전까지 완벽하게 보호)
> 3. **감성적인 출력**: "오토파일럿 활성화" 같은 기술적 용어 대신, **"누군가 나를 믿어준다는 것."** 혹은 **"혼자가 아니라는 확신."** 과 같은 문학적인 문구가 화면에 잠시 나타났다 사라집니다.

## Proposed Changes

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- `inputBuffer` 상태 전역 관리: 키보드 입력을 누적하여 키워드 매칭을 감시합니다.
- `isAutopilot` 상태 추가: 활성화 시 자동 점프 로직을 가동합니다.
- `autopilotMessage` 및 `messageAlpha` 추가: 화면에 표시할 문구와 투명도 제어.
- **AI Logic**: `gameLoop` 내에서 가장 가까운 장애물의 x 좌표를 확인하여 임계값 이하일 때 `jump()`를 강제 호출합니다.

### [MODIFY] [src/components/Game.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/components/Game.tsx)
- `useGameLoop`로부터 `autopilotMessage`와 `messageAlpha`를 전달받아, 화면 상단이나 중앙에 부드러운 화이트 텍스트로 렌더링합니다.

## Open Questions

> [!NOTE]
> 1. **활성화 해제**: 오토파일럿을 다시 끌 수 있는 방법도 필요할까요? 아니면 한 번 믿음을 주면 게임이 끝날 때까지 유지할까요?
> 2. **문구 내용**: "누군가 나를 믿어준다는 것." 이 문구로 확정할까요, 아니면 다른 추천 문구가 있으신가요?

## Verification Plan

### Manual Verification
- 게임 플레이 중 키보드로 `believe` 혹은 `믿는다`를 입력했을 때 선인장을 자동으로 피하는지 확인.
- 문구가 화면에 페이드 인/아웃으로 아름답게 나타나는지 확인.
