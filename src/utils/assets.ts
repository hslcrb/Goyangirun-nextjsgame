export const COLORS: Record<string, string> = {
  ' ': 'transparent',
  '0': '#000000', // Black outline
  '1': '#FF9800', // Orange body
  '2': '#FFFFFF', // White
  '3': '#FFCDD2', // Pink ear/nose
  '4': '#F44336', // Red (enemy)
  '5': '#4CAF50', // Green (cactus/ground)
};

export const CAT_RUN_1 = [
  "   00    00   ",
  "  0130000310  ",
  " 011111111110 ",
  " 012011110210 ",
  " 011133331110 ",
  "  011111111000",
  "  011111111110",
  "  011111111110",
  "   0111111110 ",
  "    000  000  ",
  "    0 0  0 0  ",
  "   0000 0000  "
];

export const CAT_RUN_2 = [
  "   00    00   ",
  "  0130000310  ",
  " 011111111110 ",
  " 012011110210 ",
  " 011133331110 ",
  "  011111111000",
  "  011111111110",
  "  011111111110",
  "   0111111110 ",
  "    000  000  ",
  "     0 0  0 0 ",
  "    0000 0000 "
];

export const OBSTACLE_CACTUS = [
  "   000   ",
  "  05550  ",
  "  05550 0",
  " 00555005",
  " 50555555",
  " 50555000",
  " 005550  ",
  "  05550  ",
  "  05550  ",
  "  05550  ",
  "  00000  "
];

export function drawPixelArt(
  ctx: CanvasRenderingContext2D,
  pixelData: string[],
  x: number,
  y: number,
  pixelSize: number = 4
) {
  for (let row = 0; row < pixelData.length; row++) {
    for (let col = 0; col < pixelData[row].length; col++) {
      const char = pixelData[row][col];
      if (char !== ' ') {
        ctx.fillStyle = COLORS[char];
        ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}
