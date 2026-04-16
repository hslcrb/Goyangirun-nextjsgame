'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import { audioManager } from '@/utils/audio';
import { useState } from 'react';

export default function Game() {
  const { canvasRef, isGameOver, score, isStarted, startGame, jump, releaseJump } = useGameLoop();
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(audioManager.toggleMute());
  };

  return (
    <div className="select-none relative flex flex-col items-center justify-center p-8 bg-pink-50/80 backdrop-blur-sm rounded-xl shadow-[0_20px_50px_rgba(255,182,193,0.3)] overflow-hidden border-4 border-pink-200">
      
      {/* Top Bar for Score and Mute Button */}
      <div className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={toggleMute}
          className="px-4 py-2 bg-pink-200 hover:bg-pink-300 text-pink-800 rounded-full font-bold shadow-sm transition-colors z-10 focus:outline-none"
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

      {(!isStarted || isGameOver) && (
        <div className="absolute top-[80px] left-8 right-8 bottom-8 flex flex-col items-center justify-center bg-pink-100/40 backdrop-blur-md rounded-xl z-20">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-transform border-4 border-pink-300">
            {!isStarted && !isGameOver && (
              <>
                <h1 className="text-5xl font-black text-pink-500 mb-2 tracking-wider drop-shadow-sm">고양이런 🎀</h1>
                <p className="text-pink-400 mb-6 font-bold">크롬 공룡 스타일 핑크 고양이 게임</p>
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={startGame}
                    className="px-10 py-4 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white font-bold rounded-full text-xl shadow-lg shadow-pink-400/50 transition-all hover:-translate-y-1"
                  >
                    💖 볼륨 켜고 귀엽게 시작하기
                  </button>
                  <p className="text-sm text-pink-400/80">스페이스바를 누르거나 화면을 클릭해서 점프!</p>
                </div>
              </>
            )}
            
            {isGameOver && (
              <>
                <h1 className="text-6xl font-black text-pink-600 mb-4 uppercase tracking-widest drop-shadow-md">앗!</h1>
                <p className="text-2xl font-bold text-pink-800 mb-2">선인장이 뾰족했어요 🌵</p>
                <p className="text-xl text-pink-500 mb-8 border-t-2 border-b-2 border-pink-100 py-2">최종 점수: <span className="font-black text-3xl">{score}</span></p>
                <button
                  onClick={startGame}
                  className="px-10 py-4 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-bold rounded-full text-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1"
                >
                  다시 달리기 🐈
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
