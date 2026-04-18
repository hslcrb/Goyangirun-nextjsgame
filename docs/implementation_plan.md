# 🌸 [신규 프로젝트] 프루티거 에어로 & 리미널 스페이스 감성 BGM 대작전

기존의 감미로운 배경음악을 확장하여, 약 3분간의 유기적인 흐름을 가진 "아름다우면서도 슬픈" 고퀄리티 전자음악으로 진화시킵니다.

## User Review Required

> [!IMPORTANT]
> 1. **곡의 구조 (3분 대서사시)**: 단순 반복이 아닌, 게임 진행 시간에 따라 악기가 점진적으로 추가되는 **레이어드 시퀀싱(Layered Sequencing)**을 도입합니다.
> 2. **추가될 가상 악기**:
>    - **Drums (Beats)**: 90년대 말~2000년대 초반의 낙관적 전자음(Frutiger Aero) 느낌을 주는 깔끔한 킥, 스네어, 하이햇.
>    - **Strings (현악기)**: 바이올린과 첼로의 가슴 아픈 선율을 구현하기 위해 **Sawtooth wave + LPF + Slow Attack** 조합의 신스를 사용합니다.
>    - **Glassy Plucks**: 유리 구슬이 구르는 듯한 맑은 소리(FM 합성 방식)를 추가하여 몽환적인 느낌을 더합니다.
> 3. **감성 테마**: "낯선데 익숙한", "리미널 스페이스" 같은 묘한 향수를 불러일으키기 위해 약간의 **Detune(미세한 음정 불일치)**과 **에코 효과**를 코드 레벨에서 시뮬레이션합니다.

## Proposed Changes

### [MODIFY] [src/utils/audio/bgm.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/audio/bgm.ts)

- **Advanced Multi-Track Sequencer**: 
    - `ChordTrack`, `MelodyTrack`, `DrumTrack`, `StringTrack`을 각각 분리하여 관리합니다.
    - 게임 시작 후 경과 시간(Beat Index)에 따라 각 트랙의 볼륨을 부드럽게 페이드 인/아웃 시킵니다.
- **New Sound Engines**:
    - `scheduleDrum`: 노이즈 제너레이터를 이용한 타악기 합성.
    - `scheduleString`: 현악기 특유의 느린 어택과 풍성한 배음을 가진 신스 보이스.
    - `scheduleGlass`: 프루티거 에어로 특유의 투명한 소리.

### [MODIFY] [src/hooks/useGameLoop.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/hooks/useGameLoop.ts)
- 음악의 레이어가 바뀌는 타이밍을 게임 루프와 연동하거나, 시퀀서 내부에서 자체적으로 시간을 추적하여 변화를 줍니다.

## Open Questions

> [!NOTE]
> 1. **사운드 밀도**: 3분 내내 쉬지 않고 연주하기보다는, 중간에 악기가 싹 빠지면서 텅 빈 느낌(리미널 스페이스의 공허함)을 주는 구간을 넣는 것은 어떨까요?
> 2. **비트 스타일**: "프루티거 에어로" 느낌을 위해 아주 깔끔하고 투명한 비트를 사용할까요, 아니면 "추억"의 느낌을 위해 약간 지지직거리는 로우파이(Lo-fi)한 비트를 사용할까요?

## Verification Plan

### Manual Verification
- 음악이 3분 동안 어떻게 변화하는지 끝까지 들어보며 감정적인 흐름(아름다움 -> 슬픔 -> 향수)이 잘 전달되는지 확인.
- 각 악기(바이올린, 드럼 등)가 서로 부딪히지 않고 조화롭게 레이어링되는지 확인.
