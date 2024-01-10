import React, { useState, useEffect } from 'react';
import './game.css';
import start from './start.png';
import stop from './stop.png';

export default function GameWindow() {
    const [menuHidden, setMenuHidden] = useState(false);
    const [carPosition, setCarPosition] = useState(50);
    const [direction, setDirection] = useState(null);
    const [obstacles, setObstacles] = useState([]);
    const [gamePaused, setGamePaused] = useState(true);
    const [roadLines, setRoadLines] = useState([]);
    const [speed, setSpeed] = useState(1);
    
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
        const speedAccelerationInterval = setInterval(() => {
            setSpeed((prevSpeed) => prevSpeed + 0.2); 
        }, 10000);

        return () => clearInterval(speedAccelerationInterval);
    }, [speed]);

    useEffect(() => {
        
        if (menuHidden && !gamePaused) {
            const obstacleInterval = setInterval(() => {
                const newObstacle = {
                    id: Date.now(),
                    left: Math.random() * 80 + 10,
                    top: -15, 
                    type: Math.random() < 0.5 ? 'blue' : 'green',
                    size: Math.random() < 0.5 ? 'small' : 'large',
                };

                setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
            }, 1500);

            const roadLineInterval = setInterval(() => {
                const newRoadLine = {
                    id: Date.now(),
                    top: -10,
                };

                setRoadLines((prevRoadLines) => [...prevRoadLines, newRoadLine]);
            }, 1000); 

            return () => {
                clearInterval(obstacleInterval);
                clearInterval(roadLineInterval);
            };
        }
    }, [menuHidden,gamePaused, speed]);

    useEffect(() => {
        if (gamePaused) {
            return; 
        }
    
        const obstacleMoveInterval = setInterval(() => {
            setObstacles((prevObstacles) =>
                prevObstacles
                    .map((obstacle) => ({
                        ...obstacle,
                        top: obstacle.top + speed,
                    }))
                    .filter((obstacle) => obstacle.top <= 110)
            );

            setRoadLines((prevRoadLines) =>
                prevRoadLines
                    .map((roadLine) => ({
                        ...roadLine,
                        top: roadLine.top + speed,
                    }))
                    .filter((roadLine) => roadLine.top <= 110)
                );
            }, 20);

            return () => clearInterval(obstacleMoveInterval);
        }, [speed, gamePaused]);
    

    useEffect(() => {
        let animationFrameId;

        const moveCar = () => {
            const maxPosition = 95;
            const minPosition = 5;

            if (direction === 'ArrowLeft') {
                setCarPosition((prevPosition) => Math.max(prevPosition - 1, minPosition));
            } else if (direction === 'ArrowRight') {
                setCarPosition((prevPosition) => Math.min(prevPosition + 1, maxPosition));
            }

            animationFrameId = requestAnimationFrame(moveCar);
        };

        if (direction && !gamePaused) {
            moveCar();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [direction,gamePaused]);

    function startGame() {
        setMenuHidden(true);
        setGamePaused(false);
    }
    function toggleGame() {
        setGamePaused((prevGamePaused) => !prevGamePaused);
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
                    <img className='start-stop' src={gamePaused ? start : stop} alt="" onClick={toggleGame}/>

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