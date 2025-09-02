

import React from 'react';
import { Link } from 'react-router-dom';

const HeaderBanner = () => {
  return (
    <div className="banner-bg">
      <div className="banner-content">
        <div className="text-container">
          <h5 className="pro">Pro. Beyond.</h5>
          <h1 className="iPhone">iPhone 15 Pro</h1>
          <p className="paragraph">
            Created to change everything for the better. For everyone.
          </p>
          <Link to="/products">
            <button className="shopNow-button">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderBanner;