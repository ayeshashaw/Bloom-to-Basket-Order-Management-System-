import React from 'react';
import './Header.css';
import home from "../../assets/images/home.jpeg";

const Header = () => {
  return (
    <div className='header'>
      <div className='header-content'>
        <div className='header-left'>
          <h1 className='header-title'>
            Fresh From Farm<br />
            <span className='header-title-orange'>To Your Table</span>
          </h1>
          <p className='header-description'>
            Connect directly with local farmers for fresh, seasonal produce. 
            Support sustainable agriculture and enjoy healthy, delicious food.
          </p>
          <div className='header-buttons'>
            <button className='shop-btn'>Shop Now</button>
            <button className='farmers-btn'>Meet Our Farmers</button>
          </div>
        </div>
        <div className='header-right'>
          <div className='header-image'>
            <img src={home} alt="Fresh farm food" /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
