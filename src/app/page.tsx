import Game from '@/components/Game';

export const metadata = {
  title: '고양이런 (Cat Run) - Pink Edition',
  description: '크롬 공룡 스타일 핑크 고양이 런닝 게임',
};

export default function Home() {
  return (
    <main 
      className="flex min-h-screen items-center justify-center bg-pink-100"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <Game />
    </main>
  );
}
