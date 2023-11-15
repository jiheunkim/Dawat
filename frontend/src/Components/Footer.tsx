import React, { useState } from 'react';
import './Footer.css';

function Footer() {

  return (
    <>
    <div className="footer-bg">
        <div className='footer-container'>
            <img className="fab fa-typo1" alt="logo" src="/image/dawat_logo_p.png" />
            DAWAT
        </div>
        <p className='info-text'>ⓒ2023. DAWAT. All rights reserved.</p>
    </div>
    </>
  );
}

export default Footer;