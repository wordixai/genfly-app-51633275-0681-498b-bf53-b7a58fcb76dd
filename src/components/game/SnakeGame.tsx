import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 150;

// Direction types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Position interface
interface Position {
  x: number;
  y: number;
}

const SnakeGame: React.FC = () => {
  const { toast } = useToast();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  // Check if position is occupied by snake
  const isPositionOccupied = useCallback((pos: Position): boolean => {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }, [snake]);

  // Place food in a valid position
  const placeFood = useCallback((): void => {
    let newFood = generateFood();
    while (isPositionOccupied(newFood)) {
      newFood = generateFood();
    }
    setFood(newFood);
  }, [generateFood, isPositionOccupied]);

  // Handle key presses
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (gameOver || isPaused) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction, gameOver, isPaused]);

  // Reset game
  const resetGame = (): void => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    placeFood();
    setIsPaused(false);
  };

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = (): void => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        // Move head based on direction
        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check for collisions with walls
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          toast({
            title: "Game Over!",
            description: `You hit a wall. Final score: ${score}`,
            variant: "destructive"
          });
          return prevSnake;
        }

        // Check for collisions with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          toast({
            title: "Game Over!",
            description: `You hit yourself. Final score: ${score}`,
            variant: "destructive"
          });
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => prevScore + 1);
          placeFood();
          toast({
            title: "Yum!",
            description: "Food eaten!",
            variant: "default"
          });
        } else {
          // Remove tail if no food was eaten
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, placeFood, score, snake, toast]);

  // Set up key listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Initialize food
  useEffect(() => {
    placeFood();
  }, [placeFood]);

  // Render game grid
  const renderGrid = (): JSX.Element[] => {
    const cells: JSX.Element[] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;
        
        let cellClass = "absolute";
        
        if (isSnake) {
          cellClass += isHead ? " bg-green-600" : " bg-green-400";
        } else if (isFood) {
          cellClass += " bg-red-500";
        } else {
          cellClass += " bg-gray-200";
        }
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
            }}
          />
        );
      }
    }
    
    return cells;
  };

  // Render controls for mobile
  const renderControls = (): JSX.Element => {
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div></div>
        <Button 
          onClick={() => direction !== 'DOWN' && setDirection('UP')}
          disabled={gameOver || isPaused}
          className="p-2"
        >
          ↑
        </Button>
        <div></div>
        
        <Button 
          onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
          disabled={gameOver || isPaused}
          className="p-2"
        >
          ←
        </Button>
        <Button 
          onClick={() => setIsPaused(prev => !prev)}
          className="p-2"
        >
          {isPaused ? '▶' : '❚❚'}
        </Button>
        <Button 
          onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
          disabled={gameOver || isPaused}
          className="p-2"
        >
          →
        </Button>
        
        <div></div>
        <Button 
          onClick={() => direction !== 'UP' && setDirection('DOWN')}
          disabled={gameOver || isPaused}
          className="p-2"
        >
          ↓
        </Button>
        <div></div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Snake Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div>Score: {score}</div>
          {gameOver && <div className="text-red-500">Game Over!</div>}
          {isPaused && !gameOver && <div>Paused</div>}
        </div>
        
        <div 
          className="relative border border-gray-300"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            margin: '0 auto',
          }}
        >
          {renderGrid()}
        </div>
        
        {renderControls()}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetGame} variant="outline" className="mr-2">
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SnakeGame;