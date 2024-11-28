import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProductNavbar = () => {
  return (
    <nav className='product-nav'>
      <Link to="/" className="logo">Paynder</Link>
      <ul>
        <li><Link to="/invoice">Create Invoice</Link></li>
        <li><Link to="/send">Send</Link></li>
        <li><Link to="/links">Links</Link></li>
        <li><Link to="/onramp">On-Ramp & Off-Ramp</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
      <button type="button" className="btn btn-primary" id="connectWalletButton">
        Connect Wallet
      </button>
    </nav>
  );
};

export default ProductNavbar;
