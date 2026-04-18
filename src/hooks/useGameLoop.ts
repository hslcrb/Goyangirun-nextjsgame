import { useEffect, useRef, useState } from 'react';
import * as Sprites from '../utils/assets';
import { drawPixelArt, getHeartSprite } from '../utils/assets';
import { audioManager } from '../utils/audio';

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
    gameOverAlpha: 0,
    isAutopilot: false,
    inputBuffer: '',
    messageAlpha: 0
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
    const s = state.current;
    
    // Autopilot logic during start (if triggered on start screen)
    if (s.isAutopilot) {
      s.messageAlpha = 2;
      setAutopilotMessage('누군가 나를 믿어준다는 것.');
      setMessageAlpha(2);
    } else {
      setAutopilotMessage('');
      setMessageAlpha(0);
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

    const gameLoop = () => {
      const s = state.current;

      if (s.isStarted && !s.isGameOver) {
        s.frameCount++;
        if (s.cat.iframeTime > 0) s.cat.iframeTime--;
        if (s.cat.smileTime > 0) s.cat.smileTime--;
        
        s.cat.y += s.cat.vy;
        if (s.cat.y < GROUND_Y - s.cat.height) {
          if (s.cat.isHoldingJump && s.cat.vy < 0) {
            s.cat.vy += 0.45;
          } else {
            s.cat.vy += 1.0;
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

          if (rand > 0.8) {
            type = 'churu'; w = 36; h = 24;
          } else if (rand > 0.4) {
            type = 'cactus_large'; w = 48; h = 48;
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

          const baseInterval = Math.max(40, 100 - Math.floor(s.speed * 4));
          s.nextSpawnTime = s.frameCount + baseInterval + Math.floor(Math.random() * 40) - 10;
        }

        s.entities.forEach(ent => { ent.x -= s.speed; });

        // Particles
        s.heartParticles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.alpha -= 0.02;
        });
        s.heartParticles = s.heartParticles.filter(p => p.alpha > 0);

        if (s.frameCount % 10 === 0) {
          s.score++;
          s.speed += 0.005;
        }

        s.entities = s.entities.filter(ent => ent.x + ent.width > 0 && ent.active);

        // Collision
        let hitDamage = 0;
        for (let ent of s.entities) {
          if (!ent.active) continue;
          const p = ent.type === 'cactus_large' ? 6 : 4;
          const catRect = { left: s.cat.x + 24, right: s.cat.x + s.cat.width - 24, top: s.cat.y + 15, bottom: s.cat.y + s.cat.height - 6 };
          const entRect = { left: ent.x + p, right: ent.x + ent.width - p, top: ent.y + p, bottom: ent.y + ent.height };

          if (catRect.left < entRect.right && catRect.right > entRect.left &&
              catRect.top < entRect.bottom && catRect.bottom > entRect.top) {
            if (ent.type === 'churu') {
              ent.active = false;
              s.hp = Math.min(15, s.hp + 3);
              s.cat.smileTime = 60;
              setHp(s.hp);
              audioManager.playHeal();
            } else if (s.cat.iframeTime <= 0) {
              const overlapArea = (Math.min(catRect.right, entRect.right) - Math.max(catRect.left, entRect.left)) * 
                                  (Math.min(catRect.bottom, entRect.bottom) - Math.max(catRect.top, entRect.top));
              if (ent.type === 'cactus_large') hitDamage = overlapArea > 1000 ? 6 : 3;
              else hitDamage = overlapArea > 800 ? 3 : (overlapArea > 300 ? 2 : 1);
              break;
            }
          }
        }

        if (hitDamage > 0) {
          s.hp -= hitDamage;
          s.cat.iframeTime = 60;
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

        // Autopilot AI
        if (s.isAutopilot) {
          const nearest = s.entities.find(e => e.type.includes('cactus') && e.x > s.cat.x);
          if (nearest) {
            const threshold = 130 + s.speed * 8;
            if (nearest.x - s.cat.x < threshold && !s.cat.isJumping) jump();
          }
        }
      }

      // Always update UI states
      if (s.isGameOver && s.gameOverAlpha < 1) {
        s.gameOverAlpha += 0.015;
        setGameOverAlpha(s.gameOverAlpha);
      }
      if (s.messageAlpha > 0) {
        s.messageAlpha -= 0.015;
        setMessageAlpha(Math.max(0, s.messageAlpha));
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const catKey = s.isGameOver ? 'CAT_SMILE_1' : (s.cat.smileTime > 0 ? (s.frameCount % 20 < 10 ? 'CAT_SMILE_1' : 'CAT_SMILE_2') : (s.cat.isJumping ? 'CAT_RUN_1' : (s.frameCount % 20 < 10 ? 'CAT_RUN_1' : 'CAT_RUN_2')));
      const catSprite = (Sprites as any)[catKey];
      if (catSprite) {
        drawPixelArt(ctx, catSprite, s.cat.x, s.cat.y, 3, s.cat.iframeTime > 0 && s.frameCount % 10 < 5 ? 0.5 : 1);
      }

      s.entities.forEach(ent => {
        const entKey = (ent.type === 'cactus_small' ? 'OBSTACLE_CACTUS_SMALL' : (ent.type === 'cactus_large' ? 'OBSTACLE_CACTUS_LARGE' : 'ITEM_CHURU'));
        const entSprite = (Sprites as any)[entKey];
        if (entSprite) {
          drawPixelArt(ctx, entSprite, ent.x, ent.y, 3);
        }
      });

      const maxHearts = 5;
      for (let i = 0; i < maxHearts; i++) {
        const heartValue = Math.max(0, Math.min(3, s.hp - i * 3));
        drawPixelArt(ctx, getHeartSprite(heartValue === 3, heartValue > 0 && heartValue < 3), 20 + i * 40, 20, 4);
      }

      s.heartParticles.forEach(p => {
        drawPixelArt(ctx, p.sprite, p.x, p.y, 4, Math.max(0, p.alpha));
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = state.current;
      // Buffer for Easter Egg
      if (e.key.length === 1 || e.key === ' ') {
        s.inputBuffer = (s.inputBuffer + e.key).slice(-30).toLowerCase();
        
        // Support both composed and partially decomposed Korean keywords
        const keywords = ['believe', '믿어', '믿는다', '난 널 믿어', '난널믿어', '널 믿는다', 'belive'];
        if (keywords.some(kw => s.inputBuffer.includes(kw.toLowerCase()))) {
          s.isAutopilot = true;
          s.messageAlpha = 2;
          setAutopilotMessage('누군가 나를 믿어준다는 것.');
          s.inputBuffer = '';
        }
      }

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        audioManager.init();
        if (!s.isStarted || s.isGameOver) startGame();
        else jump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') releaseJump();
    };

    const prevent = (e: Event) => e.preventDefault();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', prevent);
    window.addEventListener('dragstart', prevent);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', prevent);
      window.removeEventListener('dragstart', prevent);
    };
  }, []);

  return { 
    canvasRef, isGameOver, score, isStarted, hp, gameOverAlpha, 
    autopilotMessage, messageAlpha, startGame, jump, releaseJump 
  };
}
