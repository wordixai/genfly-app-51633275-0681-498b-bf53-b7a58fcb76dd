import MemoryGame from "@/components/game/MemoryGame";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">记忆配对游戏</h1>
      <div className="w-full max-w-md">
        <MemoryGame />
      </div>
      <div className="mt-8 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">游戏规则</h2>
        <ul className="list-disc list-inside text-left">
          <li>点击卡片将其翻开</li>
          <li>每次只能翻开两张卡片</li>
          <li>如果两张卡片匹配，它们将保持翻开状态</li>
          <li>如果不匹配，它们将被翻回</li>
          <li>目标是用最少的步数找到所有匹配对</li>
        </ul>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;