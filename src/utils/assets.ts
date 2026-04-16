export const COLORS: Record<string, string> = {
  ' ': 'transparent',
  '0': '#4A3B42', // Dark brownish outline for that soft look
  '1': '#FFB6C1', // Light Pink body
  '2': '#FFFFFF', // White
  '3': '#FF69B4', // Hot pink ear/nose/cheeks
  '4': '#F44336', // Red (enemy)
  '5': '#A5D6A7', // Pastel green (cactus/ground)
  'H': '#FF1744', // Heart red
  'G': '#B0BEC5', // Grey for empty heart
  'M': '#E0E0E0', // Mouse grey
  'P': '#F48FB1', // Mouse pink tail/nose
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

// Cute Jumping Cat - Hands up!
export const CAT_JUMP = [
  " 00        00 ",
  "0110      0110",
  "01300000000310",
  " 011111111110 ",
  " 032011110230 ", // Winking / cute eyes
  " 011133331110 ",
  "  011111111000",
  "  011111111110",
  "  011111111110",
  "   0111111110 ",
  "    0110110   ",
  "    0000000   "
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

export const OBSTACLE_CACTUS_LARGE = [
  "    000      ",
  "   05550  00 ",
  "   05550 0550",
  "  00555005550",
  " 050555555500",
  " 05055555550 ",
  " 05055555550 ",
  " 00555500000 ",
  "  055550     ",
  "  055550     ",
  "  055550     ",
  "  055550     ",
  "  000000     "
];

export const ITEM_MOUSE = [
  "       000 ",
  "     0022P0",
  "  000222200",
  " 0MM02222P0",
  " 0MM000000 ",
  "  0M0      ",
  " PPP       ",
];

// Max HP is 15 (3 parts * 5 hearts).
// Heart arrays
export const HEART_FULL = [
  " 000 000 ",
  "0HHH0HHH0",
  "0HHHHHHH0",
  "0HHHHHHH0",
  " 0HHHHH0 ",
  "  0HHH0  ",
  "   0H0   ",
  "    0    "
];

export const HEART_TWO_THIRDS = [
  " 000 000 ",
  "0HHH0G000",
  "0HHHH0G00",
  "0HHHH0G00",
  " 0HHH00  ",
  "  0HH0   ",
  "   0H0   ",
  "    0    "
];

export const HEART_ONE_THIRD = [
  " 000 000 ",
  "0HH000G00",
  "0HH0G0G00",
  "0H0G00G00",
  " 00G000  ",
  "  000    ",
  "   00    ",
  "    0    "
];

export const HEART_EMPTY = [
  " 000 000 ",
  "000000G00",
  "00G0G0G00",
  "00G000G00",
  " 00G000  ",
  "  000    ",
  "   00    ",
  "    0    "
];

export function getHeartSprite(amount: number) {
  if (amount >= 3) return HEART_FULL;
  if (amount === 2) return HEART_TWO_THIRDS;
  if (amount === 1) return HEART_ONE_THIRD;
  return HEART_EMPTY;
}

export function drawPixelArt(
  ctx: CanvasRenderingContext2D,
  pixelData: string[],
  x: number,
  y: number,
  pixelSize: number = 4,
  alpha: number = 1
) {
  const originalGlobalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  for (let row = 0; row < pixelData.length; row++) {
    for (let col = 0; col < pixelData[row].length; col++) {
      const char = pixelData[row][col];
      if (char !== ' ') {
        ctx.fillStyle = COLORS[char];
        ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
      }
    }
  }
  ctx.globalAlpha = originalGlobalAlpha;
}
