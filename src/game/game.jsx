import React, { useState, useEffect } from 'react';
import './game.css';
import audiRs6 from './audi-rs6.png';
import tachka from './tachka.png';
import start from './start.png';
import stop from './stop.png';
import obstacleBlueImage from './bike.png';
import obstacleGreenImage from './vrag.png';
import obstacleLargeImage from './bus.png';

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
    const [isMouseDownLeft, setIsMouseDownLeft] = useState(false);
    const [isMouseDownRight, setIsMouseDownRight] = useState(false);
    const movementSpeed = 0.15;
    const [backgroundPosition, setBackgroundPosition] = useState(0);
    const backgroundHeight = 100;
    const [displayedSpeed, setDisplayedSpeed] = useState(0);
    
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
        const handleTouchStart = (event) => {
            const touchX = event.touches[0].clientX;
            const screenWidth = window.innerWidth;

            if (touchX < screenWidth / 2) {
                setIsMouseDownLeft(true);
            } else {
                setIsMouseDownRight(true);
            }
        };

        const handleTouchEnd = () => {
            setIsMouseDownLeft(false);
            setIsMouseDownRight(false);
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    useEffect(() => {
        let speedIncreaseInterval;
    
        if (!gamePaused) {
            speedIncreaseInterval = setInterval(() => {
                setDisplayedSpeed((prevDisplayedSpeed) => Math.min(prevDisplayedSpeed + 100 / 1400, speed));
            }, 150); // я сам не понял немного
        }
    
        return () => clearInterval(speedIncreaseInterval);
    }, [gamePaused, speed]);

    useEffect(() => {
        let animationFrameId;
        const moveCar = () => {
            const maxPosition = 95;
            const minPosition = 5;

            if (isMouseDownLeft && carPosition > minPosition) {
                setCarPosition((prevPosition) => Math.max(prevPosition - movementSpeed, minPosition));
            } else if (isMouseDownRight && carPosition < maxPosition) {
                setCarPosition((prevPosition) => Math.min(prevPosition + movementSpeed, maxPosition));
            }

            animationFrameId = requestAnimationFrame(moveCar);
        };

        if ((isMouseDownLeft || isMouseDownRight) && !gamePaused) {
            moveCar();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMouseDownLeft, isMouseDownRight, carPosition, gamePaused]);

    useEffect(() => {
        if (gamePaused) {
            return; 
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
                    top: -40,
                    type: Math.random() < 0.33 ? 'blue' : Math.random() < 0.66 ? 'green' : 'large',
                };

                setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);

                const newRoadLine = {
                    id: Date.now(),
                    top: -10,
                };

                setRoadLines((prevRoadLines) => [...prevRoadLines, newRoadLine]);
            }, 1000); 

            return () => clearInterval(obstacleInterval);
        }
    }, [menuHidden, gamePaused]);

    useEffect(() => {
        if (gamePaused) {
            return;
        }
    
        const backgroundMoveInterval = setInterval(() => {
            setBackgroundPosition((prevPosition) => (prevPosition + speed) % backgroundHeight);
        }, 20);
    
        return () => {
            clearInterval(backgroundMoveInterval);
        };
    }, [speed, gamePaused]);

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
            const checkCollisions = () => {
                const carWidth = 10;
                const carHeight = 15;

                const carLeft = carPosition;
                const carTop = 85;

                obstacles.forEach((obstacle) => {
                    const obstacleLeft = obstacle.left;
                    const obstacleTop = obstacle.top;
                    let obstacleWidth, obstacleHeight;

                    if (obstacle.type === 'large') {
                        obstacleWidth = 12;
                        obstacleHeight = 25;
                    } else if (obstacle.type === 'green') {
                        obstacleWidth = 10;
                        obstacleHeight = 15;
                    } else {
                        obstacleWidth = 5;
                        obstacleHeight = 10;
                    }

                    const carRight = carLeft + carWidth;
                    const carBottom = carTop + carHeight;
                    const obstacleRight = obstacleLeft + obstacleWidth;
                    const obstacleBottom = obstacleTop + obstacleHeight;

                    // Create or update hitbox divs
                    createOrUpdateHitbox('car-hitbox', carLeft, carTop, carWidth, carHeight);
                    createOrUpdateHitbox(`obstacle-hitbox-${obstacle.id}`, obstacleLeft, obstacleTop, obstacleWidth, obstacleHeight);

                    if (
                        carLeft < obstacleRight &&
                        carRight > obstacleLeft &&
                        carTop < obstacleBottom &&
                        carBottom > obstacleTop
                    ) {
                        console.log('Collision!');

                        setGamePaused(true);
                        setObstacles([]);
                        setSpeed(1);
                        setLose(true);
                        removeHitboxes(); 
                    }
                });
            };

            const removeHitboxes = () => {
                document.querySelectorAll('[id^="car-hitbox"]').forEach((hitbox) => hitbox.remove());
                document.querySelectorAll('[id^="obstacle-hitbox"]').forEach((hitbox) => hitbox.remove());
            };

            const createOrUpdateHitbox = (id, left, top, width, height) => {
                let hitbox = document.getElementById(id);
            
                if (!hitbox) {
                    hitbox = document.createElement('div');
                    hitbox.id = id;
                    hitbox.style.position = 'absolute';
                    hitbox.style.border = '2px solid red';
                    hitbox.style.transform = 'translate(-95%, -50%)'; 
                    document.querySelector('.road').appendChild(hitbox);
                }
            
                const centerX = left + width / 2;
                const centerY = top + height / 2;
            
                hitbox.style.left = `${centerX}%`;
                hitbox.style.top = `${centerY}vh`;
                hitbox.style.width = `${width}%`;
                hitbox.style.height = `${height}vh`;
            };

            const collisionCheckInterval = setInterval(checkCollisions, 0);

            return () => {
                clearInterval(collisionCheckInterval);
                removeHitboxes(); 
            };
        }, [carPosition, obstacles, gamePaused]);

                
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

        if (direction && !gamePaused) {
            moveCar();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [direction,gamePaused]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setGamePaused(true);
            } else {
                setGamePaused(false);
            }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [gamePaused]);

    function getObstacleImage(type) {
        switch (type) {
            case 'blue':
                return `url(${obstacleBlueImage})`;
            case 'green':
                return `url(${obstacleGreenImage})`;
            case 'large':
                return `url(${obstacleLargeImage})`;
            default:
                return '';
        }
    }

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
    function restart() {
        setLose(false);
        setGamePaused(true); 
        setMenuHidden(true); 
        setObstacles([]); 
        setSpeed(1); 
        setGamePaused(false);
    }
    return (
        <div>
            <div className={`menu ${menuHidden && 'hidden'}`}>
                <h1>ГОНКИ</h1>
                <button className="burger" onClick={showMenu}>Выбор машины</button>
                <div className={`carsMenu ${menuVisible && 'visible'}`}>
                    <h1>Меню выбора</h1>
                    <button onClick={showMenu} className='close-btn'></button>
                    <div className='catalog'>
                        <div className={`card ${carImage === audiRs6 && 'chosen'}`}onClick={() => changeCar(audiRs6)}>
                            <img src={audiRs6} alt="car" />
                            <h2>Ауди рс 6</h2>
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
            <div className='grass' style={{ backgroundPosition: `0 ${backgroundPosition}vh` }}></div>
                <div className='road' style={{ backgroundPosition: `0 ${backgroundPosition}vh` }}>
                    <div className='railing left'></div>
                    <div className='railing right'></div>
                    <div className='car' style={{ left: `${carPosition}%`, backgroundImage: `url(${carImage})` }}></div>
                    <img className='start-stop' src={gamePaused ? start : stop} alt="" onClick={toggleGame}/>
                    <div className={`lose ${!isLose && 'hidden'}`}>
                    <div className="popup">
                        <h1>РАЗМОТАЛСЯ НЫФЛИА</h1>
                        <button className='restart start-btn' onClick={restart}>Заново</button>
                    </div>
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
                            className={`obstacle ${obstacle.type}`}
                            style={{
                                left: `${obstacle.left}%`,
                                top: `${obstacle.top}vh`,
                                backgroundImage: getObstacleImage(obstacle.type),
                            }}
                        ></div>
                    ))}
                </div>
                <div className="speedometer">
                    <p>Скорость: {(displayedSpeed * 17).toFixed(0)} км/ч</p>
                </div>
            </div>
        </div>
    );
}