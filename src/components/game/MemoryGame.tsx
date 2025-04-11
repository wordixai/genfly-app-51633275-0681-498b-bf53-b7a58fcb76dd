import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// 游戏常量
const GRID_SIZE = 4; // 4x4 网格
const CARD_TYPES = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🍑']; // 8种不同的卡片类型

interface CardItem {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryGame: React.FC = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  // 初始化游戏
  const initializeGame = useCallback(() => {
    // 创建卡片对
    const cardPairs = [...CARD_TYPES, ...CARD_TYPES];
    // 随机排序
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    setGameStarted(false);
    setTimer(0);
  }, []);

  // 处理卡片点击
  const handleCardClick = (id: number) => {
    // 如果游戏结束或卡片已经翻开或已经匹配，则不做任何操作
    if (
      gameOver ||
      flippedCards.length >= 2 ||
      cards[id].flipped ||
      cards[id].matched
    ) {
      return;
    }

    // 如果是第一次点击卡片，开始游戏
    if (!gameStarted) {
      setGameStarted(true);
    }

    // 翻开卡片
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    // 添加到已翻开的卡片列表
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // 如果翻开了两张卡片，检查是否匹配
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;

      if (cards[firstId].value === cards[secondId].value) {
        // 匹配成功
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].matched = true;
          matchedCards[secondId].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);

          toast({
            title: "匹配成功!",
            description: "你找到了一对匹配的卡片!",
            variant: "default"
          });

          // 检查游戏是否结束
          if (matchedPairs + 1 === CARD_TYPES.length) {
            setGameOver(true);
            toast({
              title: "恭喜!",
              description: `你用了 ${moves + 1} 步和 ${timer} 秒完成了游戏!`,
              variant: "default"
            });
          }
        }, 500);
      } else {
        // 匹配失败，翻回卡片
        setTimeout(() => {
          const unmatchedCards = [...cards];
          unmatchedCards[firstId].flipped = false;
          unmatchedCards[secondId].flipped = false;
          setCards(unmatchedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // 重置游戏
  const resetGame = () => {
    initializeGame();
    toast({
      title: "游戏已重置",
      description: "开始新的游戏!",
      variant: "default"
    });
  };

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // 初始化游戏
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 渲染卡片网格
  const renderCards = () => {
    return (
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square flex items-center justify-center rounded-md cursor-pointer text-3xl transition-all duration-300 transform ${
              card.flipped || card.matched
                ? 'bg-blue-500 text-white rotate-y-180'
                : 'bg-gray-300 text-transparent hover:bg-gray-400'
            } ${card.matched ? 'bg-green-500' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">记忆配对游戏</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div>步数: {moves}</div>
          <div>时间: {timer}秒</div>
          <div>匹配: {matchedPairs}/{CARD_TYPES.length}</div>
        </div>
        
        {renderCards()}
        
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetGame} variant="outline" className="mr-2">
          重新开始
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemoryGame;