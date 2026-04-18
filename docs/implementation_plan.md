# 모바일 환경 최적화 계획

현재 데스크탑 중심의 게임 환경을 모바일 기기에서도 쾌적하게 즐길 수 있도록 터치 컨트롤과 반응형 UI를 적용합니다.

## User Review Required

> [!IMPORTANT]
> 1. **터치 컨트롤 (Touch Controls)**: 스페이스바 대신 화면 어디든 터치하여 점프하고 게임을 시작할 수 있도록 `touchstart` 및 `touchend` 이벤트를 지원합니다.
> 2. **반응형 캔버스 (Responsive Canvas)**: 모바일 화면 비율에 맞춰 캔버스가 유연하게 크기를 조절하되, 픽셀 아트의 선명함(`pixelated`)은 유지하도록 CSS를 조정합니다.
> 3. **이벤트 간섭 방지**: 모바일에서 게임 중 화면이 스크롤되거나 확대되지 않도록 전용 스타일(`touch-action: none`)을 적용합니다.

## Proposed Changes

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- `touchstart` 및 `touchend` 이벤트 리스너 추가.
    - `touchstart`: `jump()` 및 `startGame()` 트리거.
    - `touchend`: `releaseJump()` 트리거.
- 브라우저 기본 동작(스크롤, 줌) 방지 로직 강화.

### [MODIFY] [src/components/Game.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/components/Game.tsx)
- 모바일 가로 모드 및 세로 모드 대응을 위한 CSS 클래스 업데이트.
- 메인 컨테이너와 오버레이 레이아웃의 `flex` 로직을 모바일 친화적으로 조정.

### [MODIFY] [src/app/globals.css](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/app/globals.css)
- 모바일에서의 '클릭 하이라이트' 제거 및 텍스트 선택 방지 스타일 추가.

## Open Questions

> [!NOTE]
> 1. **화면 방향**: 이 게임은 가로형(Landscape)에 최적화되어 있습니다. 모바일 사용자가 세로로 들고 있을 때 "가로로 돌려주세요"라는 안내를 띄울까요, 아니면 세로 화면에서도 캔버스를 작게 보여줄까요?

## Verification Plan

### Manual Verification
- 브라우저 개발자 도구의 **Mobile Emulator**를 사용하여 터치 이벤트가 점프로 정상 작동하는지 확인.
- 다양한 해상도(iPhone, iPad 등)에서 UI가 깨지지 않고 비율에 맞게 줄어드는지 확인.
