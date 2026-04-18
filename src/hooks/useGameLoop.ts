import { useEffect, useRef, useState } from 'react';
import * as Sprites from '../utils/assets';
import { drawPixelArt, getHeartSprite, MOUNTAIN_DISTANT, CLOUD_SMALL, SAKURA_TREE_FAR } from '../utils/assets';
import { audioManager } from '../utils/audio';
import { SakuraEngine, ParallaxEngine } from '../utils/background/sakura';

// --- Constants for Physics Simulation ---
const GRAVITY = 1.0;
const GRAVITY_HOLD = 0.45;
const JUMP_FORCE = -16;
const FPS = 60;

type GameObject = {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  active: boolean;
};

type HeartParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  sprite: string[];
};

export function useGameLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [hp, setHp] = useState(15); 
  const [gameOverAlpha, setGameOverAlpha] = useState(0);
  const [autopilotMessage, setAutopilotMessage] = useState('');
  const [messageAlpha, setMessageAlpha] = useState(0);

  const state = useRef({
    cat: { 
      x: 50, y: 0, width: 120, height: 57, vy: 0, 
      isJumping: false, iframeTime: 0, isHoldingJump: false, smileTime: 0 
    },
    entities: [] as GameObject[],
    heartParticles: [] as HeartParticle[],
    score: 0,
    hp: 15,
    speed: 5,
    frameCount: 0,
    isGameOver: false,
    isStarted: false,
    nextEntityId: 0,
    nextSpawnTime: 60,
    gameOverAlpha: 0,
    isAutopilot: false,
    inputBuffer: '',
    messageAlpha: 0
  });

  // --- Perfect Prediction Math Engine ---
  /**
   * Simulates vertical position after t frames
   */
  const simulateY = (y0: number, v0: number, t: number, holding: boolean) => {
    let currY = y0;
    let currV = v0;
    const g = holding ? GRAVITY_HOLD : GRAVITY;
    const groundY = 300 - 20 - 57; // GROUND_Y - cat_height

    for (let i = 0; i < t; i++) {
      currY += currV;
      if (currY < groundY) {
        // Holding logic is more complex in real loop, but here we simplify
        // In loop: if vy < 0 and holding -> GRAVITY_HOLD else GRAVITY
        const effectiveG = (holding && currV < 0) ? GRAVITY_HOLD : GRAVITY;
        currV += effectiveG;
      } else {
        currY = groundY;
        currV = 0;
        break;
      }
    }
    return currY;
  };

  const jump = () => {
    state.current.cat.isHoldingJump = true;
    if (state.current.cat.isJumping || state.current.isGameOver || !state.current.isStarted) return;
    state.current.cat.vy = JUMP_FORCE;
    state.current.cat.isJumping = true;
    audioManager.playJump();
  };

  const releaseJump = () => {
    state.current.cat.isHoldingJump = false;
  };

  const startGame = () => {
    const s = state.current;
    if (s.isAutopilot) {
      s.messageAlpha = 2;
      setAutopilotMessage('누군가 나를 믿어준다는 것.');
      setMessageAlpha(2);
    }
    audioManager.init();
    audioManager.startBgm();

    state.current = {
      ...state.current,
      cat: { x: 50, y: 0, width: 120, height: 57, vy: 0, isJumping: false, iframeTime: 0, isHoldingJump: false, smileTime: 0 },
      entities: [],
      heartParticles: [],
      score: 0,
      hp: 15,
      speed: 5,
      frameCount: 0,
      isGameOver: false,
      isStarted: true,
      nextEntityId: 0,
      nextSpawnTime: 60,
      gameOverAlpha: 0,
      inputBuffer: ''
    };
    
    setIsStarted(true);
    setIsGameOver(false);
    setScore(0);
    setHp(15);
    setGameOverAlpha(0);
  };

  const spawnBrokenHeart = (x: number, y: number, damage: number) => {
    const s = state.current;
    for(let i=0; i<damage; i++) {
      s.heartParticles.push({
        x: x + Math.random() * 20,
        y: y - Math.random() * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: -5 - Math.random() * 5,
        alpha: 1,
        sprite: [" H ","HHH"," H "] 
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const GROUND_Y = canvas.height - 20;

    // --- Background Engines ---
    const sakuraEngine = new SakuraEngine(canvas.width, canvas.height);
    const parallaxEngine = new ParallaxEngine(canvas.width);
    
    // Far mountains (slowest)
    parallaxEngine.addLayer(MOUNTAIN_DISTANT, 180, 0.05, 5, 3);
    // Clouds
    parallaxEngine.addLayer(CLOUD_SMALL, 40, 0.1, 4, 4);
    // Far trees
    parallaxEngine.addLayer(SAKURA_TREE_FAR, 200, 0.4, 3, 5);

    const gameLoop = () => {
      const s = state.current;

      // Update background elements even if not started
      parallaxEngine.update(s.isStarted && !s.isGameOver ? s.speed : 0.5);
      sakuraEngine.update(s.isStarted && !s.isGameOver ? s.speed : 0.5, s.cat.vy);

      if (s.isStarted && !s.isGameOver) {
        s.frameCount++;
        if (s.cat.iframeTime > 0) s.cat.iframeTime--;
        if (s.cat.smileTime > 0) s.cat.smileTime--;
        
        s.cat.y += s.cat.vy;
        if (s.cat.y < GROUND_Y - s.cat.height) {
          if (s.cat.isHoldingJump && s.cat.vy < 0) {
            s.cat.vy += GRAVITY_HOLD;
          } else {
            s.cat.vy += GRAVITY;
          }
        } else {
          s.cat.y = GROUND_Y - s.cat.height;
          s.cat.vy = 0;
          s.cat.isJumping = false;
        }

        // Spawn logic
        if (s.frameCount >= s.nextSpawnTime) {
          const rand = Math.random();
          let type = 'cactus_small';
          let w = 24, h = 36;
          if (rand > 0.8) { type = 'churu'; w = 36; h = 24; }
          else if (rand > 0.4) { type = 'cactus_large'; w = 48; h = 48; }

          s.entities.push({
            type, x: canvas.width, y: GROUND_Y - h, width: w, height: h,
            id: s.nextEntityId++, active: true
          });

          const baseInterval = Math.max(35, 90 - Math.floor(s.speed * 4));
          s.nextSpawnTime = s.frameCount + baseInterval + Math.floor(Math.random() * 30);
        }

        s.entities.forEach(ent => { ent.x -= s.speed; });

        // Particles
        s.heartParticles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.alpha -= 0.02;
        });
        s.heartParticles = s.heartParticles.filter(p => p.alpha > 0);

        if (s.frameCount % 10 === 0) {
          s.score++;
          s.speed += 0.006; // Slightly faster scaling
        }

        s.entities = s.entities.filter(ent => ent.x + ent.width > 0 && ent.active);

        // Collision
        let hitDamage = 0;
        const catHitbox = { 
          left: s.cat.x + 24, right: s.cat.x + s.cat.width - 24, 
          top: s.cat.y + 15, bottom: s.cat.y + s.cat.height - 6 
        };

        for (let ent of s.entities) {
          if (!ent.active) continue;
          const p = ent.type === 'cactus_large' ? 6 : 4;
          const entRect = { left: ent.x + p, right: ent.x + ent.width - p, top: ent.y + p, bottom: ent.y + ent.height };

          if (catHitbox.left < entRect.right && catHitbox.right > entRect.left &&
              catHitbox.top < entRect.bottom && catHitbox.bottom > entRect.top) {
            if (ent.type === 'churu') {
              ent.active = false;
              s.hp = Math.min(15, s.hp + 3);
              s.cat.smileTime = 60;
              setHp(s.hp);
              audioManager.playHeal();
            } else if (s.cat.iframeTime <= 0) {
              const overlap = (Math.min(catHitbox.right, entRect.right) - Math.max(catHitbox.left, entRect.left)) * 
                              (Math.min(catHitbox.bottom, entRect.bottom) - Math.max(catHitbox.top, entRect.top));
              hitDamage = ent.type === 'cactus_large' ? (overlap > 1000 ? 6 : 3) : (overlap > 800 ? 3 : (overlap > 300 ? 2 : 1));
              break;
            }
          }
        }

        if (hitDamage > 0) {
          s.hp -= hitDamage; s.cat.iframeTime = 60;
          audioManager.playDamage();
          spawnBrokenHeart(s.cat.x + s.cat.width/2, s.cat.y, hitDamage);
          if (s.hp <= 0) {
            s.hp = 0; s.isGameOver = true; s.isAutopilot = false;
            setIsGameOver(true);
            audioManager.fadeOutBgm(1.5);
          }
          setHp(s.hp);
        }
        if (s.score % 10 === 0) setScore(s.score);

        // --- GOD-MODE Autopilot AI (Advanced Mathematical Engine) ---
        if (s.isAutopilot) {
          const hazards = s.entities.filter(e => e.type.includes('cactus') && e.x > s.cat.x - 50);
          const catXFront = s.cat.x + 80;
          
          if (hazards.length > 0) {
            const nearest = hazards[0];
            const dist = nearest.x - catXFront;
            const timeToImpact = dist / s.speed;

            // Decision: Jump if impact is within safe window
            // We use different lead times for different speeds for extreme precision
            const leadTime = 16 + (s.speed * 0.4); 

            if (timeToImpact < leadTime && !s.cat.isJumping) {
              jump();
            }

            // Optimization: Maintain airtime if another hazard is coming
            if (s.cat.isJumping) {
              // Simulate landing position
              const jumpTotalFrames = 45; // Approx
              const landingX = catXFront + s.speed * jumpTotalFrames;
              
              const futureHazard = hazards.find(h => h.x > nearest.x + nearest.width);
              // If there's a gap that we should glide over
              if (futureHazard && futureHazard.x < landingX + 50) {
                s.cat.isHoldingJump = true;
              } else if (catXFront < nearest.x + nearest.width + 10) {
                s.cat.isHoldingJump = true;
              } else {
                s.cat.isHoldingJump = false;
              }
            }
          }
        }
      }

      if (s.isGameOver && s.gameOverAlpha < 1) {
        s.gameOverAlpha += 0.015; setGameOverAlpha(s.gameOverAlpha);
      }
      if (s.messageAlpha > 0) {
        s.messageAlpha -= 0.015; setMessageAlpha(Math.max(0, s.messageAlpha));
      }

      // --- Rendering Order ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Far Background (Static gradient)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#FFE4E1'); // Misty Rose
      gradient.addColorStop(1, '#FFF5F5');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Parallax Layers
      parallaxEngine.draw(ctx);

      // 3. Middleground Petals
      sakuraEngine.draw(ctx);

      // 4. Game Objects
      const catKey = s.isGameOver ? 'CAT_SMILE_1' : (s.cat.smileTime > 0 ? (s.frameCount % 20 < 10 ? 'CAT_SMILE_1' : 'CAT_SMILE_2') : (s.cat.isJumping ? 'CAT_RUN_1' : (s.frameCount % 20 < 10 ? 'CAT_RUN_1' : 'CAT_RUN_2')));
      const catSprite = (Sprites as any)[catKey];
      if (catSprite) drawPixelArt(ctx, catSprite, s.cat.x, s.cat.y, 3, s.cat.iframeTime > 0 && s.frameCount % 10 < 5 ? 0.5 : 1);

      s.entities.forEach(ent => {
        const entKey = (ent.type === 'cactus_small' ? 'OBSTACLE_CACTUS' : (ent.type === 'cactus_large' ? 'OBSTACLE_CACTUS_LARGE' : 'ITEM_CHURU'));
        const entSprite = (Sprites as any)[entKey];
        if (entSprite) drawPixelArt(ctx, entSprite, ent.x, ent.y, 3);
      });

      for (let i = 0; i < 5; i++) {
        const heartValue = Math.max(0, Math.min(3, s.hp - i * 3));
        drawPixelArt(ctx, getHeartSprite(heartValue === 3, heartValue > 0 && heartValue < 3), 20 + i * 40, 20, 4);
      }

      s.heartParticles.forEach(p => drawPixelArt(ctx, p.sprite, p.x, p.y, 4, p.alpha));
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = state.current;
      if (e.key.length === 1 || e.key === ' ') {
        s.inputBuffer = (s.inputBuffer + e.key).slice(-30).toLowerCase();
        if (['believe', '믿어', '믿는다', '난 널 믿어', '난널믿어', '널 믿는다', 'belive'].some(kw => s.inputBuffer.includes(kw))) {
          s.isAutopilot = true; s.messageAlpha = 2;
          setAutopilotMessage('누군가 나를 믿어준다는 것.');
          s.inputBuffer = '';
        }
      }
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        audioManager.init();
        if (!s.isStarted || s.isGameOver) startGame(); else jump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'ArrowUp') releaseJump(); };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      audioManager.init();
      if (!state.current.isStarted || state.current.isGameOver) {
        startGame();
      } else {
        jump();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      releaseJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('dragstart', (e) => e.preventDefault());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return { canvasRef, isGameOver, score, isStarted, hp, gameOverAlpha, autopilotMessage, messageAlpha, startGame, jump, releaseJump };
}
