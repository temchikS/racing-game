import React, { useState, useEffect } from 'react';
import './game.css';
import audiRs6 from './audi-rs6.png';
import tachka from './tachka.png';
import start from './start.png';
import stop from './stop.png';
export default function GameWindow() {
    const [menuHidden, setMenuHidden] = useState(false);
    const [carPosition, setCarPosition] = useState(50);
    const [direction, setDirection] = useState(null);
    const [obstacles, setObstacles] = useState([]);
    const [gamePaused, setGamePaused] = useState(true);
    const [roadLines, setRoadLines] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [carImage, setCarImage] = useState(audiRs6);
    const [speed, setSpeed] = useState(1);
    const [isLose,setLose] = useState(false);
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
        if (gamePaused) {
            return; // Не обновлять препятствия, если игра приостановлена
        }
        const speedAccelerationInterval = setInterval(() => {
            setSpeed((prevSpeed) => prevSpeed + 0.2); 
        }, 10000);
        return () => clearInterval(speedAccelerationInterval);
    }, [speed,gamePaused]);

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

                const newRoadLine = {
                    id: Date.now(),
                    top: -10,
                };

                setRoadLines((prevRoadLines) => [...prevRoadLines, newRoadLine]);
            }, 1500);

            return () => clearInterval(obstacleInterval);
        }
    }, [menuHidden,gamePaused]);

    useEffect(() => {
        if (gamePaused) {
            return; // Не обновлять препятствия, если игра приостановлена
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
            const checkCollisions = () => {
                const carWidth = 10; 
                const carHeight = 20; 

                const carLeft = carPosition;
                const carTop = 85; 
        
                obstacles.forEach((obstacle) => {
                    const obstacleLeft = obstacle.left;
                    const obstacleTop = obstacle.top;
        
                    const obstacleWidth = obstacle.size === 'small' ? 5 : 10;
                    const obstacleHeight = obstacle.size === 'small' ? 10 : 20;
        
                    if (
                        carLeft < obstacleLeft + obstacleWidth &&
                        carLeft + carWidth > obstacleLeft &&
                        carTop < obstacleTop + obstacleHeight &&
                        carTop + carHeight > obstacleTop
                    ) {
                        console.log('Столкновение!');
                        setGamePaused(true);
                        setObstacles([]);
                        setSpeed(1);
                        setLose(true)
                    }
                });
            };
            const collisionCheckInterval = setInterval(checkCollisions, 20);
            return () => clearInterval(collisionCheckInterval);
        }, [carPosition, obstacles]);
        
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
    function showMenu() {
        if(!menuVisible){
            setMenuVisible(true);    
        } else{
            setMenuVisible(false);
        }
    }
    function changeCar(newCarImage) {
        setCarImage(newCarImage);
    }
    function restart(){
        setLose(false)
        setGamePaused(false)
    }
    return (
        <div>
            <div className={`menu ${menuHidden && 'hidden'}`}>
                <h1>Форсаж 69</h1>
                <button className="burger" onClick={showMenu}>Выбор машины</button>
                <div className={`carsMenu ${menuVisible && 'visible'}`}>
                    <h1>Меню выбора</h1>
                    <button onClick={showMenu} className='close-btn'></button>
                    <div className='catalog'>
                        <div className={`card ${carImage === audiRs6 && 'chosen'}`}onClick={() => changeCar(audiRs6)}>
                            <img src={audiRs6} alt="car" />
                            <h2>Ауди рс6</h2>
                        </div>
                        <div className={`card ${carImage === tachka && 'chosen'}`} onClick={() => changeCar(tachka)}>
                            <img src={tachka} alt="car" />
                            <h2>Тачка</h2>
                        </div>
                    </div>

                </div>
                <button className='start-btn' onClick={startGame}>
                    START!
                </button>
            </div>
            <div className={`game ${!menuHidden && 'hidden'}`}>
                <div className='road'>
                    <div className='railing left'></div>
                    <div className='railing right'></div>
                    <div className='car' style={{ left: `${carPosition}%`, backgroundImage: `url(${carImage})` }}></div>
                    <img className='start-stop' src={gamePaused ? start : stop} alt="" onClick={toggleGame}/>
                    <div className={`lose ${!isLose && 'hidden'}`}>
                        <h1>РАЗМОТАЛСЯ НЫФЛИА</h1>
                        <button className='restart start-btn' onClick={restart}>Заново</button>
                    </div>
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
