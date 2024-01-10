import React, { useState, useEffect } from 'react';
import './game.css';

export default function Game() {
    const [menuHidden, setMenuHidden] = useState(false);
    const [carPosition, setCarPosition] = useState(50); // Initial position at the center

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                moveCar('left');
            } else if (event.key === 'ArrowRight') {
                moveCar('right');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Adding event listener on component mount and removing on unmount

    function moveCar(direction) {
        const step = 24.2; // Adjust the step size as needed
    
        if (direction === 'left') {
            setCarPosition((prevPosition) => Math.max(prevPosition - step, 0));
        } else if (direction === 'right') {
            setCarPosition((prevPosition) => Math.min(prevPosition + step, 100));
        }
    }

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
                {/* Add the car here with dynamic left position */}
                <div className='car' style={{ left: `${carPosition}%` }}></div>
            </div>
            </div>
        </div>
    );
}