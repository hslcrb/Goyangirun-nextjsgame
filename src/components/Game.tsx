'use client';

import { useGameLoop } from '@/hooks/useGameLoop';

export default function Game() {
  const { canvasRef, isGameOver, score, isStarted, startGame, jump } = useGameLoop();

  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border-4 border-slate-300">
      <div className="absolute top-4 right-6 text-2xl font-black text-slate-800 tabular-nums tracking-widest z-10">
        SCORE: {score.toString().padStart(5, '0')}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="bg-sky-50 rounded-lg cursor-pointer max-w-full"
        onClick={() => {
          if (!isStarted || isGameOver) startGame();
          else jump();
        }}
        style={{ imageRendering: 'pixelated' }}
      />

      {(!isStarted || isGameOver) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl z-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform">
            {!isStarted && !isGameOver && (
              <>
                <h1 className="text-4xl font-black text-orange-500 mb-4 tracking-wider">고양이런 🐱</h1>
                <p className="text-slate-600 mb-6 font-medium">스페이스바를 누르거나 화면을 클릭해서 점프!</p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-full text-lg shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
                >
                  게임 시작
                </button>
              </>
            )}
            
            {isGameOver && (
              <>
                <h1 className="text-5xl font-black text-red-500 mb-4 uppercase tracking-widest drop-shadow-sm">게임 오버</h1>
                <p className="text-2xl font-bold text-slate-700 mb-6">최종 점수: <span className="text-orange-500">{score}</span></p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-slate-800 hover:bg-black active:bg-slate-900 text-white font-bold rounded-full text-lg shadow-lg shadow-slate-800/30 transition-all hover:-translate-y-1"
                >
                  다시 하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
