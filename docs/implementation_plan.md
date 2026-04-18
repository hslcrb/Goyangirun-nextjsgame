# 감미로운 봄 테마 BGM (벚꽃 엔딩 느낌) 개발 계획

사용자의 요청에 따라, 현재의 단순한 비프음 BGM을 훨씬 감미롭고 세련된 "벚꽃 봄 테마"의 음악으로 교체합니다.

## User Review Required

> [!IMPORTANT]
> 1. **화성 진행 (Chord Progression)**: 일본 애니메이션이나 한국의 서정적인 곡들에서 자주 쓰이는 소위 '왕도 진행'(IV - V - iii - vi)을 기반으로 곡을 구성합니다. (예: Fmaj7 - G7 - Em7 - Am7)
> 2. **가상 악기 구현**: 단순한 Square wave 대신, **Triangle wave**와 **Low-pass Filter**를 조합하여 부드러운 피아노/EP(Electric Piano) 느낌의 소리를 코드로 합성합니다. 
> 3. **곡의 길이**: 약 1분 이상의 루프를 위해 메인 멜로디와 코러스 파트를 분리하여 시퀀싱합니다. 

## Proposed Changes

### [MODIFY] [src/utils/audio/bgm.ts](file:///home/rheehoselenovo2/개발프로젝트/Goyangirun/src/utils/audio/bgm.ts)

- **Polyphonic Sequencer**: 현재의 단성부 시퀀서를 다성부(코트 + 멜로디)를 연주할 수 있는 구조로 리팩토링합니다.
- **Instrument Synthesis**: 
    - **Pad**: 부드러운 배경을 깔아주는 Sine wave 기반의 패드 사운드.
    - **Melody/Pluck**: Triangle wave에 엔벨로프(Fast attack, Slow release)를 적용한 통통 튀면서도 부드러운 멜로디 악기.
- **Composition**: 
    - 64마디 이상의 시퀀스를 정의하여 약 1분 이상의 곡 구성을 만듭니다.
    - Verse (잔잔한 코드), Chorus (풍성한 멜로디) 구조를 갖춥니다.

## Open Questions

> [!NOTE]
> 1. 곡의 속도(Tempo)는 봄의 여유로운 느낌을 위해 약간 느린 90~100 BPM 정도로 설정할까요? 아니면 현재의 빠른 템포를 유지할까요? (차분한 느낌을 추천합니다.)
> 2. 배경 악기로 아주 작게 '벚꽃이 날리는 듯한' 효과(치익~ 하는 필터링된 노이즈)를 섞어보는 것은 어떨까요?

## Verification Plan

### Manual Verification
- 브라우저를 통해 음악을 들었을 때 기존의 "게임기 비프음" 느낌이 아니라 "작곡된 음악" 느낌이 나는지 청취 테스트.
- 1분 이상 재생했을 때 곡이 끊기지 않고 자연스럽게 이어지는지 확인.
