import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Address: 19 Nguyen Huu Tho Street, Tan Phong, District 7, Ho Chi Minh City </p>
          <p>Ton Duc Thang University</p>
        </div>
        <div className="footer-section">
          <h3>Members</h3>
          <ul>
            <li>522H0019 - Hoang Thi Xuan Ny</li>
            <li>522H0047 - Nguyen Ngoc Thien</li>
            <li>522H0023 - Huynh Thinh Hung</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Web Application Development Using NodeJS</p>
      </div>
    </footer>
  );
};

export default Footer; 