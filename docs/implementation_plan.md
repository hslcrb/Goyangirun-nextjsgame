# 쓸쓸한 게임 오버 (Sentimental Game Over) 연출 계획

현재의 활기차고 가벼운 게임 오버 연출을 게임의 감성적인 BGM과 어울리는 '리미널 스페이스' 스타일의 쓸쓸하고 여운 있는 연출로 교체합니다.

## User Review Required

> [!IMPORTANT]
> 1. **시각적 암전 (Screen Fade-out)**: 고양이의 체력이 다하는 순간, 화면이 서서히 블랙으로 페이드 아웃되며 색상이 어두워지는 효과를 추가합니다.
> 2. **청각적 페이드 아웃 (Audio Fade-out)**: 음악이 갑자기 끊기지 않고, 약 1~2초간 **급격하면서도 부드럽게 볼륨이 줄어들며(Gain Ramping)** 사라지도록 구현합니다.
> 3. **감성적인 문구**: 가벼운 말투 대신, "그곳에 더 이상의 봄은 없었습니다."와 같이 곡의 분위기와 어우러지는 짧고 여운 있는 문구를 중심에 배치합니다.

## Proposed Changes

### [MODIFY] [src/utils/audio/index.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/audio/index.ts)
- `AudioContextManager`에 전체 볼륨을 제어하는 `masterGain` 노드를 추가합니다. 모든 효과음과 BGM은 이 노드를 거쳐 출력되도록 수정합니다.

### [MODIFY] [src/utils/audio/bgm.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/audio/bgm.ts)
- `fadeOut(duration)` 메서드를 추가합니다. 게임 오버 시 호출되며, `masterGain`의 볼륨을 지정된 시간 동안 0으로 부드럽게 낮춘 후 시퀀서를 정지시킵니다.

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- `gameOverAlpha` 상태를 추가하여 게임 오버 발생 시 0에서 1까지 서서히 증가시킵니다.
- 렌더링 루프 마지막에 `gameOverAlpha`를 이용해 화면을 덮는 검은색 레이어를 그리고, 그 위에 새로운 감성 문구를 렌더링합니다.

## Open Questions

> [!NOTE]
> 1. **문구 내용**: "그곳에 더 이상의 봄은 없었습니다." 외에 다른 원하시는 문구가 있으신가요? (예: "끝내 닿지 못한 벚꽃 길", "기억 속으로 사라진 풍경" 등)
> 2. **암전 속도**: 음악과 화면이 사라지는 속도를 어느 정도로 할까요? (약 1.5초 정도가 여운을 주기에 적당해 보입니다.)

## Verification Plan

### Manual Verification
- 고의로 선인장에 부딪혀 체력을 0으로 만든 뒤, 화면이 어두워지고 소리가 서서히 사라지는 연출이 자연스러운지 확인.
- 게임 오버 이후 다시 시작했을 때, 볼륨(`masterGain`)이 다시 정상적으로 복구되어 음악이 나오는지 확인.
