import React, { useState, useEffect } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import './Game.css';

const Game = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [obstaclePosition, setObstaclePosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && carPosition > 0) {
        setCarPosition(carPosition - 5);
      } else if (e.key === 'ArrowRight' && carPosition < 95) {
        setCarPosition(carPosition + 5);
      }
    };

    const gameLoop = () => {
      if (!gameOver) {
        setObstaclePosition(obstaclePosition + 1);
        if (obstaclePosition > 100) {
          setObstaclePosition(0);
        }

        // Check for collision
        if (
          carPosition < obstaclePosition + 10 &&
          carPosition + 10 > obstaclePosition &&
          90 < obstaclePosition + 10
        ) {
          setGameOver(true);
        }
      }
    };

    const gameInterval = setInterval(gameLoop, 50);

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [carPosition, obstaclePosition, gameOver]);

  return (
    <div className="game-container">
      <Car position={carPosition} />
      <Obstacle position={obstaclePosition} />
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default Game;