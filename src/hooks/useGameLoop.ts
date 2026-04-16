import { useEffect, useRef, useState } from 'react';
import { drawPixelArt, getHeartSprite, CAT_RUN_1, CAT_RUN_2, CAT_JUMP, OBSTACLE_CACTUS } from '@/utils/assets';
import { audioManager } from '@/utils/audio';

type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
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

  // Game state refs
  const state = useRef({
    cat: { x: 50, y: 0, width: 56, height: 48, vy: 0, isJumping: false, iframeTime: 0 },
    obstacles: [] as GameObject[],
    heartParticles: [] as HeartParticle[],
    score: 0,
    hp: 15,
    speed: 5,
    frameCount: 0,
    isGameOver: false,
    isStarted: false,
    nextObstacleId: 0
  });

  const jump = () => {
    if (state.current.cat.isJumping || state.current.isGameOver || !state.current.isStarted) return;
    state.current.cat.vy = -16;
    state.current.cat.isJumping = true;
    audioManager.resume();
    audioManager.playJump();
  };

  const startGame = () => {
    audioManager.init();
    audioManager.resume();
    audioManager.startBgm();

    state.current = {
      cat: { x: 50, y: 0, width: 56, height: 48, vy: 0, isJumping: false, iframeTime: 0 },
      obstacles: [],
      heartParticles: [],
      score: 0,
      hp: 15,
      speed: 5,
      frameCount: 0,
      isGameOver: false,
      isStarted: true,
      nextObstacleId: 0
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
    const PIXEL_SIZE = 4;
    const GROUND_Y = canvas.height - 20;

    // Initial position
    state.current.cat.y = GROUND_Y - state.current.cat.height;

    const gameLoop = () => {
      const s = state.current;

      if (s.isStarted && !s.isGameOver) {
        s.frameCount++;
        if (s.cat.iframeTime > 0) s.cat.iframeTime--;
        
        // Physics
        s.cat.y += s.cat.vy;
        if (s.cat.y < GROUND_Y - s.cat.height) {
          s.cat.vy += 0.8; // Gravity
        } else {
          s.cat.y = GROUND_Y - s.cat.height;
          s.cat.vy = 0;
          s.cat.isJumping = false;
        }

        // Spawn obstacles
        if (s.frameCount % Math.max(50, 120 - Math.floor(s.speed * 4)) === 0) {
          s.obstacles.push({
            x: canvas.width,
            y: GROUND_Y - 44,
            width: 36,
            height: 44,
            id: s.nextObstacleId++
          });
        }

        // Move obstacles
        s.obstacles.forEach(obs => {
          obs.x -= s.speed;
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

        // Clean up passed obstacles
        s.obstacles = s.obstacles.filter(obs => obs.x + obs.width > 0);

        // Precise AABB Collision
        if (s.cat.iframeTime <= 0) {
          let hitDamage = 0;
          
          for (let i = 0; i < s.obstacles.length; i++) {
            const obs = s.obstacles[i];
            const catRect = { left: s.cat.x + 8, right: s.cat.x + s.cat.width - 8, top: s.cat.y + 8, bottom: s.cat.y + s.cat.height };
            const obsRect = { left: obs.x + 4, right: obs.x + obs.width - 4, top: obs.y + 4, bottom: obs.y + obs.height };

            // Check overlap
            if (catRect.left < obsRect.right && catRect.right > obsRect.left &&
                catRect.top < obsRect.bottom && catRect.bottom > obsRect.top) {
              
              // Calculate overlap area to determine severity
              const overlapX = Math.min(catRect.right, obsRect.right) - Math.max(catRect.left, obsRect.left);
              const overlapY = Math.min(catRect.bottom, obsRect.bottom) - Math.max(catRect.top, obsRect.top);
              const overlapArea = overlapX * overlapY;

              if (overlapArea > 800) hitDamage = 3; // Huge hit (1 full heart)
              else if (overlapArea > 300) hitDamage = 2; // Mid hit (2/3 heart)
              else hitDamage = 1; // Graze (1/3 heart)

              // Found a hit, break to apply
              break;
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
              audioManager.stopBgm();
            }
            setHp(s.hp);
          }
        }

        // Sync score
        if (s.score % 10 === 0) setScore(s.score);
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#A5D6A7'; // Pastel green
      ctx.fillRect(0, GROUND_Y, canvas.width, 4);

      // Draw Cat with iframe flashing
      const isVisible = s.cat.iframeTime <= 0 || s.frameCount % 10 < 5;
      if (isVisible) {
        let catFrame = s.cat.isJumping ? CAT_JUMP : (s.frameCount % 20 < 10 ? CAT_RUN_1 : CAT_RUN_2);
        drawPixelArt(ctx, catFrame, s.cat.x, s.cat.y, PIXEL_SIZE);
      }

      // Draw Obstacles
      s.obstacles.forEach(obs => {
        drawPixelArt(ctx, OBSTACLE_CACTUS, obs.x, obs.y, PIXEL_SIZE);
      });

      // Draw UI Hearts in canvas (top left)
      const maxHearts = 5;
      for (let i = 0; i < maxHearts; i++) {
        // Calculate chunks represented by this heart (heart 0 = hp chars 1-3, heart 1 = hp chars 4-6)
        let heartValue = Math.max(0, Math.min(3, s.hp - i * 3));
        let heartSprite = getHeartSprite(heartValue);
        drawPixelArt(ctx, heartSprite, 20 + i * 40, 20, 3); // Slightly smaller pixel size for UI
      }

      // Draw particles
      s.heartParticles.forEach(p => {
        drawPixelArt(ctx, p.sprite, p.x, p.y, 4, Math.max(0, p.alpha));
      });

      if (!s.isStarted) {
        ctx.fillStyle = '#FF69B4';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!state.current.isStarted || state.current.isGameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      audioManager.stopBgm();
    };
  }, []); // Empty deps so loop binds once

  return { canvasRef, isGameOver, score, isStarted, hp, startGame, jump };
}
