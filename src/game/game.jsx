import React, { useState } from 'react';
import './game.css';

export default function Game() {
    const [menuHidden, setMenuHidden] = useState(false);

    function startGame() {
        setMenuHidden(true);
    }

    return (
        <div>
            <div className={`menu ${menuHidden && 'hidden'}`}>
                <h1>ГОНКИ</h1>
                <button className='start-btn' onClick={startGame}>START!</button>
            </div>
            <div className={`game ${!menuHidden && 'hidden'}`}>
                <div className='road'></div>
            </div>
        </div>
    );
}
