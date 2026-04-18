# 고해상도 그래픽 및 오디오 리팩토링 Tasks

- [x] `src/utils/audio` 폴더 생성 및 `audio.ts` 분리 (`index.ts`, `bgm.ts`, `jump.ts`, `damage.ts`, `heal.ts`).
- [x] 에너지가 극적으로 채워지는 느낌의 신스 로직을 `heal.ts`에 작성.
- [x] `assets.ts` 픽셀 배열 해상도 약 2배 확장(가로 ~40~50, 세로 ~20) 및 하얀 발 도트 추가.
- [x] 츄르와 선인장 해상도 스케일업.
- [x] `CAT_SMILE_1`, `CAT_SMILE_2` 추가하여 웃을 때 꼬리 흔드는 애니메이션 구현.
- [x] `useGameLoop.ts`에서 `PIXEL_SIZE=3` 적용 및 충돌(Hitbox) 패딩 정교화.
- [x] 스마일 상태 애니메이션 로직 루프에 추가.
