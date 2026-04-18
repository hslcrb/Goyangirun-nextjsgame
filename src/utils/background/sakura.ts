import { SAKURA_PETAL, drawPixelArt } from '../assets';

export interface Petal {
  x: number;
  y: number;
  angle: number;
  rotationSpeed: number;
  horizontalSpeed: number;
  verticalSpeed: number;
  oscillationSpeed: number;
  oscillationRange: number;
  alpha: number;
  scale: number;
  phase: number;
}

export class SakuraEngine {
  private petals: Petal[] = [];
  private maxPetals = 40;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.init();
  }

  private init() {
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  private createPetal(randomY = false): Petal {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      horizontalSpeed: 0.5 + Math.random() * 1.5,
      verticalSpeed: 0.8 + Math.random() * 1.2,
      oscillationSpeed: 0.02 + Math.random() * 0.03,
      oscillationRange: 0.5 + Math.random() * 1.5,
      alpha: 0.4 + Math.random() * 0.6,
      scale: 0.8 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    };
  }

  update(gameSpeed: number, catVy: number) {
    this.petals.forEach(p => {
      // Basic movement
      p.y += p.verticalSpeed;
      p.x -= (p.horizontalSpeed + gameSpeed * 0.2); // Move with game speed slightly
      
      // Sakura flutter (Sine wave)
      p.phase += p.oscillationSpeed;
      p.x += Math.sin(p.phase) * p.oscillationRange;
      
      // Rotation
      p.angle += p.rotationSpeed;

      // React to cat's jump (Air turbulence)
      if (catVy < 0 && Math.abs(p.x - 100) < 150) {
        p.y += catVy * 0.05; // Pull up slightly
        p.x += Math.random() * 2;
      }

      // Reset when out of bounds
      if (p.y > this.height + 20 || p.x < -20) {
        Object.assign(p, this.createPetal(false));
        p.x = this.width + 20; // Spawn from right-top
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // We manually draw for rotation support or just use drawPixelArt
      // Since drawPixelArt doesn't support rotation, let's keep it simple or implement rotated draw
      drawPixelArt(ctx, SAKURA_PETAL, -8, -8, 2 * p.scale, p.alpha);
      ctx.restore();
    });
  }
}

export interface ParallaxLayer {
  sprite: string[];
  x: number;
  y: number;
  speedFactor: number;
  scale: number;
}

export class ParallaxEngine {
  private layers: ParallaxLayer[] = [];
  private width: number;

  constructor(width: number) {
    this.width = width;
  }

  addLayer(sprite: string[], y: number, speedFactor: number, scale: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.layers.push({
        sprite,
        x: Math.random() * this.width * 2,
        y,
        speedFactor,
        scale
      });
    }
  }

  update(gameSpeed: number) {
    this.layers.forEach(l => {
      l.x -= gameSpeed * l.speedFactor;
      if (l.x < -200) {
        l.x = this.width + Math.random() * 100;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.layers.forEach(l => {
      drawPixelArt(ctx, l.sprite, l.x, l.y, l.scale, 0.8);
    });
  }
}
