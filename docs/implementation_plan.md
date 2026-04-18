# 오토파일럿 및 빌드 오류 수정 계획

사용자가 입력해도 아무런 변화가 없는 문제는 최근 코드 수정 중 발생한 **빌드 오류(TypeScript Type Error)**와 **키 입력 감지 로직의 미세한 불일치** 때문일 가능성이 높습니다. 이를 신속하게 수정합니다.

## User Review Required

> [!IMPORTANT]
> 1. **빌드 오류 수정**: `drawPixelArt` 함수에 문자열(Key)이 전달되어 화면이 렌더링되지 않던 문제를 실제 픽셀 데이터 배열이 전달되도록 수정합니다.
> 2. **입력 감지 개선**: 한국어 IME 특성상 발생할 수 있는 입력 누락을 방지하고, 대소문자 구분 없이 더 정확하게 감지하도록 로직을 보강합니다.

## Proposed Changes

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- `assets.ts`에서 정의된 모든 스프라이트 상수를 임포트하여 매핑 테이블을 구축합니다.
- `drawPixelArt` 호출 시 문자열 키 대신 실제 배열 데이터를 전달합니다.
- `inputBuffer` 감지 시 다양한 입력 환경(모바일 터치 키보드, 한국어 조합 등)에서도 최대한 작동하도록 보정합니다.

### [MODIFY] [src/components/Game.tsx](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/components/Game.tsx)
- 구문 오류가 발생할 수 있는 JSX 영역을 재검토하여 완벽하게 정돈합니다.

## Open Questions

> [!NOTE]
> 1. 현재 `believe` 혹은 `믿는다`를 입력하셨을 때 화면에 아무런 피드백도 없으셨나요? (빌드 오류로 인해 화면 자체가 멈춰있었을 수 있습니다. 수정 후 바로 확인 부탁드립니다.)

## Verification Plan

### Automated Tests
- `npm run build` 또는 `npx tsc --noEmit`을 실행하여 모든 타입 오류가 사라졌는지 확인합니다.

### Manual Verification
- 게임 시작 전/중/후 모든 상태에서 `Believe` 혹은 `믿어`를 입력하여 오토파일럿이 활성화되고 문구가 나타나는지 최종 확인합니다.
