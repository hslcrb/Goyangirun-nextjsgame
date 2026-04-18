'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import { audioManager } from '@/utils/audio';
import React, { useState, useEffect } from 'react';

export default function Game() {
  const { 
    canvasRef, 
    isGameOver, 
    score, 
    isStarted, 
    gameOverAlpha, 
    autopilotMessage, 
    messageAlpha, 
    startGame, 
    jump, 
    releaseJump 
  } = useGameLoop();
  const [isMuted, setIsMuted] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // Detect orientation for mobile
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 1024);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(audioManager.toggleMute());
  };

  return (
    <div className="select-none relative flex flex-col items-center justify-center min-h-[400px] w-full max-w-[900px] p-4 md:p-8 bg-pink-50/80 backdrop-blur-sm rounded-none md:rounded-xl shadow-none md:shadow-[0_20px_50px_rgba(255,182,193,0.3)] overflow-hidden border-0 md:border-4 border-pink-200">
      
      {/* Landscape Warning for Mobile */}
      {isPortrait && (
        <div className="fixed inset-0 z-[1000] bg-pink-500 flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold mb-2">더 넓은 화면에서 고양이와 달려요!</h2>
          <p className="opacity-80">쾌적한 플레이를 위해 기기를 가로로 돌려주세요.</p>
        </div>
      )}

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <button 
          onClick={toggleMute}
          className="px-4 py-2 bg-pink-200 hover:bg-pink-300 text-pink-800 rounded-full font-bold shadow-sm transition-colors z-[120] focus:outline-none"
        >
          {isMuted ? '🔇 소리 켜기' : '🔊 소리 끄기'}
        </button>
        <div className="text-2xl font-black text-pink-600 tabular-nums tracking-widest z-10 bg-white/50 px-4 py-1 rounded-full border-2 border-pink-200">
          SCORE: {score.toString().padStart(5, '0')}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="bg-white rounded-lg cursor-pointer max-w-full shadow-inner border-2 border-pink-100"
        onMouseDown={() => {
          if (!isStarted || isGameOver) startGame();
          else jump();
        }}
        onMouseUp={() => {
          if (isStarted && !isGameOver) releaseJump();
        }}
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Intro Overlay */}
      {!isStarted && !isGameOver && (
        <div className="absolute top-[80px] left-8 right-8 bottom-8 flex flex-col items-center justify-center bg-pink-100/40 backdrop-blur-md rounded-xl z-20">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-pink-300">
            <h1 className="text-5xl font-black text-pink-500 mb-2 tracking-wider">고양이런 🎀</h1>
            <p className="text-pink-400 mb-6 font-bold">크롬 공룡 스타일 핑크 고양이 게임</p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={startGame}
                className="px-8 md:px-10 py-3 md:py-4 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-full text-lg md:text-xl shadow-lg transition-all"
              >
                💖 시작하기
              </button>
              <p className="text-xs md:text-sm text-pink-400/80 tracking-tighter">화면을 터치하거나 스페이스바를 누르세요.</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Full Screen Overlay */}
      {gameOverAlpha > 0 && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
          style={{ backgroundColor: `rgba(0, 0, 0, ${gameOverAlpha * 0.95})` }}
        >
          {gameOverAlpha > 0.4 && (
            <div 
              className="text-center px-4"
              style={{ opacity: Math.min(1, (gameOverAlpha - 0.4) * 2.5) }}
            >
              <h2 className="text-3xl md:text-5xl font-light text-white mb-8 tracking-[1em] animate-pulse">
                그곳에 더 이상의 봄은 없었습니다.
              </h2>
              <div className="h-px w-32 bg-white/20 mx-auto mb-8" />
              <p className="text-2xl text-white/50 mb-12 tracking-[0.5em] font-light">
                마지막 기억 : {score}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Autopilot Activation Message */}
      {messageAlpha > 0 && (
        <div 
          className="absolute top-1/4 left-0 right-0 pointer-events-none flex justify-center z-[110]"
          style={{ opacity: Math.min(1, messageAlpha) }}
        >
          <div className="bg-white/40 backdrop-blur-md px-10 py-4 rounded-full border border-pink-200/50 shadow-xl shadow-pink-200/20">
            <p className="text-pink-900 text-2xl font-light tracking-[0.4em] drop-shadow-sm italic">
              {autopilotMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
