import React from 'react';
import { Link } from 'react-router-dom';



const DoubleBanner = () => {
  return (
    <div className="double-banner">
      <div className="left-bg"></div>
      <div className="right-bg">
        <Link to="/products">
        <button className="shop-btn">Shop Now</button>
        </Link>
      </div>
    </div>
  );
};

export default DoubleBanner;