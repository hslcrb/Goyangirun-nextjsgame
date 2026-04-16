import { useEffect, useRef, useState } from 'react';
import { drawPixelArt, CAT_RUN_1, CAT_RUN_2, OBSTACLE_CACTUS } from '@/utils/assets';

type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useGameLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Game state refs (to avoid dependency cycles in requestAnimationFrame)
  const state = useRef({
    cat: { x: 50, y: 0, width: 56, height: 48, vy: 0, isJumping: false },
    obstacles: [] as GameObject[],
    score: 0,
    speed: 5,
    frameCount: 0,
    isGameOver: false,
    isStarted: false,
  });

  const jump = () => {
    if (state.current.cat.isJumping || state.current.isGameOver || !state.current.isStarted) return;
    state.current.cat.vy = -15;
    state.current.cat.isJumping = true;
  };

  const startGame = () => {
    state.current = {
      cat: { x: 50, y: 0, width: 56, height: 48, vy: 0, isJumping: false },
      obstacles: [],
      score: 0,
      speed: 5,
      frameCount: 0,
      isGameOver: false,
      isStarted: true,
    };
    setIsStarted(true);
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const PIXEL_SIZE = 4;
    const GROUND_Y = canvas.height - 20;

    // Initial positioning
    state.current.cat.y = GROUND_Y - state.current.cat.height;

    const gameLoop = () => {
      const s = state.current;

      // Update basic logic only if started and not game over
      if (s.isStarted && !s.isGameOver) {
        s.frameCount++;
        
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
        if (s.frameCount % Math.max(60, 150 - Math.floor(s.speed * 5)) === 0) {
          s.obstacles.push({
            x: canvas.width,
            y: GROUND_Y - 44, // 11 rows * 4 pixel size = 44 height for cactus
            width: 36, // 9 cols * 4
            height: 44,
          });
        }

        // Update obstacles & score
        s.obstacles.forEach(obs => {
          obs.x -= s.speed;
        });

        if (s.frameCount % 10 === 0) {
          s.score++;
          s.speed += 0.005; // gradually increase speed
        }

        // Clean up passed obstacles
        s.obstacles = s.obstacles.filter(obs => obs.x + obs.width > 0);

        // Check collision
        const hitboxPadding = 10;
        const collision = s.obstacles.some(obs => {
          return (
            s.cat.x + hitboxPadding < obs.x + obs.width - hitboxPadding &&
            s.cat.x + s.cat.width - hitboxPadding > obs.x + hitboxPadding &&
            s.cat.y + hitboxPadding < obs.y + obs.height - hitboxPadding &&
            s.cat.y + s.cat.height - hitboxPadding > obs.y + hitboxPadding
          );
        });

        if (collision) {
          s.isGameOver = true;
          setIsGameOver(true);
        }

        // Sync score to React occasionally
        if (s.score % 10 === 0) {
          setScore(s.score);
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, GROUND_Y, canvas.width, 4);

      // Draw Cat
      const catFrame = (s.cat.isJumping || s.frameCount % 20 < 10) ? CAT_RUN_1 : CAT_RUN_2;
      drawPixelArt(ctx, catFrame, s.cat.x, s.cat.y, PIXEL_SIZE);

      // Draw Obstacles
      s.obstacles.forEach(obs => {
        drawPixelArt(ctx, OBSTACLE_CACTUS, obs.x, obs.y, PIXEL_SIZE);
      });

      // Draw Game Over overlay in canvas (optional, but handled in React for now)
      
      // Draw Start Text if not started
      if (!s.isStarted) {
        ctx.fillStyle = '#000';
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
    };
  }, []);

  return { canvasRef, isGameOver, score, isStarted, startGame, jump };
}
