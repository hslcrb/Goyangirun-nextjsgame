import { useEffect, useRef, useState } from 'react';
import { drawPixelArt, getHeartSprite, CAT_RUN_1, CAT_RUN_2, CAT_JUMP, CAT_CRY, CAT_SMILE_1, CAT_SMILE_2, OBSTACLE_CACTUS, OBSTACLE_CACTUS_LARGE, ITEM_CHURU } from '@/utils/assets';
import { audioManager } from '@/utils/audio';

type GameObject = {
  type: 'cactus_small' | 'cactus_large' | 'churu';
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  active: boolean; // false when mouse is eaten
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
  const [hp, setHp] = useState(15); // Max 15 (5 hearts * 3 parts)
  const [gameOverAlpha, setGameOverAlpha] = useState(0);

  // Game state refs
  const state = useRef({
    cat: { x: 50, y: 0, width: 120, height: 57, vy: 0, isJumping: false, iframeTime: 0, isHoldingJump: false, smileTime: 0 },
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
    gameOverAlpha: 0
  });

  const jump = () => {
    state.current.cat.isHoldingJump = true;
    if (state.current.cat.isJumping || state.current.isGameOver || !state.current.isStarted) return;
    state.current.cat.vy = -16;
    state.current.cat.isJumping = true;
    audioManager.playJump();
  };

  const releaseJump = () => {
    state.current.cat.isHoldingJump = false;
  };

  const startGame = () => {
    audioManager.init();
    audioManager.startBgm();

    state.current = {
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
      gameOverAlpha: 0
    };
    setIsStarted(true);
    setIsGameOver(false);
    setScore(0);
    setHp(15);
  };

  const spawnBrokenHeart = (x: number, y: number, damage: number) => {
    const s = state.current;
    // Spawn small pieces based on damage amount
    for(let i=0; i<damage; i++) {
      s.heartParticles.push({
        x: x + Math.random() * 20,
        y: y - Math.random() * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: -5 - Math.random() * 5,
        alpha: 1,
        // Just use a tiny chunk of heart color as a particle, let's pass a small custom sprite
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
    const PIXEL_SIZE = 3;
    const GROUND_Y = canvas.height - 20;

    // Initial position
    state.current.cat.y = GROUND_Y - state.current.cat.height;

    const gameLoop = () => {
      const s = state.current;

      if (s.isStarted && !s.isGameOver) {
        s.frameCount++;
        if (s.cat.iframeTime > 0) s.cat.iframeTime--;
        if (s.cat.smileTime > 0) s.cat.smileTime--;
        
        // Physics (Variable Jump)
        s.cat.y += s.cat.vy;
        if (s.cat.y < GROUND_Y - s.cat.height) {
          // Less gravity if holding jump and moving up
          if (s.cat.isHoldingJump && s.cat.vy < 0) {
            s.cat.vy += 0.45;
          } else {
            s.cat.vy += 0.8; // Normal gravity
          }
        } else {
          s.cat.y = GROUND_Y - s.cat.height;
          s.cat.vy = 0;
          s.cat.isJumping = false;
        }

        // Spawn entities dynamically
        if (s.frameCount >= s.nextSpawnTime) {
          const rand = Math.random();
          let type: 'cactus_small' | 'cactus_large' | 'churu' = 'cactus_small';
          let w = 36, h = 45; // 12x15 * 3
          
          if (rand > 0.9) {
            type = 'churu';
            w = 78; // 26 cols * 3
            h = 18; // 6 rows * 3
          } else if (rand > 0.6) {
            type = 'cactus_large';
            w = 48; // 16 cols * 3
            h = 57; // 19 rows * 3
          }

          s.entities.push({
            type,
            x: canvas.width,
            y: GROUND_Y - h,
            width: w,
            height: h,
            id: s.nextEntityId++,
            active: true
          });

          // Next spawn varies based on speed
          const baseInterval = Math.max(40, 100 - Math.floor(s.speed * 4));
          const variance = Math.floor(Math.random() * 40) - 10;
          s.nextSpawnTime = s.frameCount + baseInterval + variance;
        }

        // Move entities
        s.entities.forEach(ent => {
          ent.x -= s.speed;
        });

        // Move particles
        s.heartParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.5; // grabity
          p.alpha -= 0.02;
        });
        s.heartParticles = s.heartParticles.filter(p => p.alpha > 0);

        if (s.frameCount % 10 === 0) {
          s.score++;
          s.speed += 0.005; // gradually increase speed
        }

        // Clean up passed entities
        s.entities = s.entities.filter(ent => ent.x + ent.width > 0 && ent.active);

        // Precise AABB Collision
        let hitDamage = 0;
        
        for (let i = 0; i < s.entities.length; i++) {
          const ent = s.entities[i];
          if (!ent.active) continue;

          // Padding differs by type to be forgiving
          const p = ent.type === 'cactus_large' ? 6 : 4;
          // Cat width is 120px (40x3). 
          const catRect = { left: s.cat.x + 24, right: s.cat.x + s.cat.width - 24, top: s.cat.y + 15, bottom: s.cat.y + s.cat.height - 6 };
          const entRect = { left: ent.x + p, right: ent.x + ent.width - p, top: ent.y + p, bottom: ent.y + ent.height };

          // Check overlap
          if (catRect.left < entRect.right && catRect.right > entRect.left &&
              catRect.top < entRect.bottom && catRect.bottom > entRect.top) {
            
            if (ent.type === 'churu') {
              ent.active = false; // Eat churu
              s.hp = Math.min(15, s.hp + 3); // Heal 1 heart (3 parts)
              s.cat.smileTime = 60; // Smile for ~1 sec
              setHp(s.hp);
              audioManager.playHeal();
            } else if (s.cat.iframeTime <= 0) {
              // Calculate overlap area to determine severity
              const overlapX = Math.min(catRect.right, entRect.right) - Math.max(catRect.left, entRect.left);
              const overlapY = Math.min(catRect.bottom, entRect.bottom) - Math.max(catRect.top, entRect.top);
              const overlapArea = overlapX * overlapY;

              if (ent.type === 'cactus_large') {
                if (overlapArea > 1000) hitDamage = 6; // 2 hearts
                else hitDamage = 3; // 1 heart
              } else {
                if (overlapArea > 800) hitDamage = 3; 
                else if (overlapArea > 300) hitDamage = 2; 
                else hitDamage = 1; 
              }
              break; // exit loop after finding a hit to process
            }
          }
        }

        if (hitDamage > 0) {
          s.hp -= hitDamage;
          s.cat.iframeTime = 60; // ~1 second of invincibility at 60fps
          audioManager.playDamage();
          spawnBrokenHeart(s.cat.x + s.cat.width/2, s.cat.y, hitDamage);
          
          if (s.hp <= 0) {
            s.hp = 0;
            s.isGameOver = true;
            setIsGameOver(true);
            audioManager.fadeOutBgm(1.5); // 1.5s fade out
          }
          setHp(s.hp);
        }

        // Sync score
        if (s.score % 10 === 0) setScore(s.score);
      }

      const isActuallyGameOver = s.isGameOver;
      if (isActuallyGameOver && s.gameOverAlpha < 1) {
        s.gameOverAlpha += 0.015; // Approx 1s fade
        setGameOverAlpha(s.gameOverAlpha);
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#A5D6A7'; // Pastel green
      ctx.fillRect(0, GROUND_Y, canvas.width, 4);

      // Draw Cat with iframe flashing
      const isVisible = s.cat.iframeTime <= 0 || s.frameCount % 10 < 5;
      if (isVisible) {
        let catFrame = CAT_RUN_1;
        if (s.cat.iframeTime > 0) {
          catFrame = CAT_CRY;
        } else if (s.cat.smileTime > 0) {
          catFrame = s.frameCount % 20 < 10 ? CAT_SMILE_1 : CAT_SMILE_2;
        } else if (s.cat.isJumping) {
          catFrame = CAT_JUMP;
        } else {
          catFrame = s.frameCount % 20 < 10 ? CAT_RUN_1 : CAT_RUN_2;
        }
        drawPixelArt(ctx, catFrame, s.cat.x, s.cat.y, PIXEL_SIZE);
      }

      // Draw Entities
      s.entities.forEach(ent => {
        if (!ent.active) return;
        let sprite = OBSTACLE_CACTUS;
        if (ent.type === 'cactus_large') sprite = OBSTACLE_CACTUS_LARGE;
        if (ent.type === 'churu') sprite = ITEM_CHURU;
        drawPixelArt(ctx, sprite, ent.x, ent.y, PIXEL_SIZE);
      });

      // Draw UI Hearts in canvas (top left)
      const maxHearts = 5;
      for (let i = 0; i < maxHearts; i++) {
        const heartValue = Math.max(0, Math.min(3, s.hp - i * 3));
        let heartSprite = getHeartSprite(heartValue === 3, heartValue > 0 && heartValue < 3);
        drawPixelArt(ctx, heartSprite, 20 + i * 40, 20, 4);
      }

      // Draw particles
      s.heartParticles.forEach(p => {
        drawPixelArt(ctx, p.sprite, p.x, p.y, 4, Math.max(0, p.alpha));
      });

      if (!s.isStarted) {
        ctx.fillStyle = '#FF69B4';
        ctx.font = '20px "OneStoreMobilePop", sans-serif';
        ctx.textAlign = 'center';
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        audioManager.init();
        if (!state.current.isStarted || state.current.isGameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        releaseJump();
      }
    };

    const preventDefault = (e: Event) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', preventDefault);
    window.addEventListener('dragstart', preventDefault);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('dragstart', preventDefault);
      audioManager.stopBgm();
    };
  }, []); // Empty deps so loop binds once

  return { canvasRef, isGameOver, score, isStarted, hp, gameOverAlpha, startGame, jump, releaseJump };
}
