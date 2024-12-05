// Future imports for functionality:
// import Web3 from 'web3';
// import { useWeb3 } from '../hooks/useWeb3';
// import { generatePaymentLink } from '../utils/paymentUtils';
import React from "react";


const PaymentLinks: React.FC = () => {
  return (
    <div className="product-interface">
      <div className="form-container">
        <h2>Payment Links</h2>
        <form>
          <div className="form-group">
            <label htmlFor="linkDescription">Description:</label>
            <input
              type="text"
              className="form-control"
              id="linkDescription"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stablecoin">Select Stablecoin:</label>
            <select
              className="form-control"
              id="stablecoin"
              required
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="cUSD">cUSD</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="network">Select Network:</label>
            <select
              className="form-control"
              id="network"
              required
            >
              <option value="Celo">Celo Network</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              step="0.01"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Generate Link</button>
        </form>
        <div id="paymentLinkOutput" className="mt-4" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
};

export default PaymentLinks;
