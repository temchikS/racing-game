import React, { useState, useEffect } from 'react';
import './game.css';

export default function Game() {
    const [menuHidden, setMenuHidden] = useState(false);
    const [carPosition, setCarPosition] = useState(50);
    const [direction, setDirection] = useState(null);
    const [obstacles, setObstacles] = useState([]);
    const [roadLines, setRoadLines] = useState([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                setDirection(event.key);
            }
        };

        const handleKeyUp = () => {
            setDirection(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (menuHidden) {
            const obstacleInterval = setInterval(() => {
                const newObstacle = {
                    id: Date.now(),
                    left: Math.random() * 80 + 10,
                    top: -15, 
                    type: Math.random() < 0.5 ? 'blue' : 'green',
                    size: Math.random() < 0.5 ? 'small' : 'large',
                };

                setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);

                const newRoadLine = {
                    id: Date.now(),
                    top: -10,
                };

                setRoadLines((prevRoadLines) => [...prevRoadLines, newRoadLine]);
            }, 1500);

            return () => clearInterval(obstacleInterval);
        }
    }, [menuHidden]);

    useEffect(() => {
        const obstacleMoveInterval = setInterval(() => {
            setObstacles((prevObstacles) =>
                prevObstacles
                    .map((obstacle) => ({
                        ...obstacle,
                        top: obstacle.top + (window.innerWidth <= 768 ? 2 : 1),
                    }))
                    .filter((obstacle) => obstacle.top <= 110) // Remove obstacles when they go below 110vh
            );
    
            setRoadLines((prevRoadLines) =>
                prevRoadLines
                    .map((roadLine) => ({
                        ...roadLine,
                        top: roadLine.top + (window.innerWidth <= 768 ? 2 : 1),
                    }))
                    .filter((roadLine) => roadLine.top <= 110) // Remove road lines when they go below 110vh
            );
        }, 20);
    
        return () => clearInterval(obstacleMoveInterval);
    }, []);

    useEffect(() => {
        let animationFrameId;

        const moveCar = () => {
            const maxPosition = 100;
            const minPosition = 0;

            if (direction === 'ArrowLeft') {
                setCarPosition((prevPosition) => Math.max(prevPosition - 1, minPosition));
            } else if (direction === 'ArrowRight') {
                setCarPosition((prevPosition) => Math.min(prevPosition + 1, maxPosition));
            }

            animationFrameId = requestAnimationFrame(moveCar);
        };

        if (direction) {
            moveCar();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [direction]);

    function startGame() {
        setMenuHidden(true);
    }

    return (
        <div>
            <div className={`menu ${menuHidden && 'hidden'}`}>
                <h1>ГОНКИ</h1>
                <button className='start-btn' onClick={startGame}>
                    START!
                </button>
            </div>
            <div className={`game ${!menuHidden && 'hidden'}`}>
                <div className='road'>
                    <div className='railing left'></div>
                    <div className='railing right'></div>
                    <div className='car' style={{ left: `${carPosition}%` }}></div>

                    {roadLines.map((roadLine) => (
                        <div
                            key={roadLine.id}
                            className='road-line'
                            style={{
                                top: `${roadLine.top}vh`,
                            }}
                        ></div>
                    ))}

                    {obstacles.map((obstacle) => (
                        <div
                            key={obstacle.id}
                            className={`obstacle ${obstacle.type} ${obstacle.size}`}
                            style={{
                                left: `${obstacle.left}%`,
                                top: `${obstacle.top}vh`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}