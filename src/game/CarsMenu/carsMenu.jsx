import React, { useState } from 'react';
import './carsMenu.css';
import krestik from './close.png';
export default function CarsMenu() {
    const [menuVisible, setMenuVisible] = useState(false);

    function showMenu() {
        if(!menuVisible){
            setMenuVisible(true);    
        } else{
            setMenuVisible(false);
        }
        
    }

    return (
        <div>
            <button className="burger" onClick={showMenu}>Выбор машины</button>
            <div className={`carsMenu ${menuVisible && 'visible'}`}>
                <h1>Меню выбора</h1>
                <button onClick={showMenu} className='close-btn'><img src={krestik} alt="" /></button>
            </div>
        </div>
    );
}