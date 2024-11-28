import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav>
      <Link to="/" className="logo">Paynder</Link>
      <ul>
        <li>
          {isHomePage ? (
            <a href="#Products">Products</a>
          ) : (
            <Link to="/#Products">Products</Link>
          )}
        </li>
        <li>
          {isHomePage ? (
            <a href="#about">About</a>
          ) : (
            <Link to="/#about">About</Link>
          )}
        </li>
        <li>
          {isHomePage ? (
            <a href="#contact">Contact</a>
          ) : (
            <Link to="/#contact">Contact</Link>
          )}
        </li>
        <li><Link to="/invoice">Launch Beta</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;