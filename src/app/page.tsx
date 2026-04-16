import Game from '@/components/Game';

export const metadata = {
  title: '고양이런 (Cat Run)',
  description: '크롬 공룡 스타일 픽셀 고양이 런닝 게임',
};

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-200">
      <Game />
    </main>
  );
}
