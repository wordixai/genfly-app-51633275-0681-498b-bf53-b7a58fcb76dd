import SnakeGame from "@/components/game/SnakeGame";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Snake Game</h1>
      <div className="w-full max-w-md">
        <SnakeGame />
      </div>
      <div className="mt-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">How to Play</h2>
        <ul className="list-disc list-inside text-left">
          <li>Use arrow keys to control the snake</li>
          <li>Eat the red food to grow</li>
          <li>Avoid hitting the walls or yourself</li>
          <li>Press spacebar to pause/resume</li>
          <li>Use on-screen controls on mobile devices</li>
        </ul>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;