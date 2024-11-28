import React from 'react';

const SendPayments: React.FC = () => {
  return (
    <div className="product-interface">
      <div className="form-container">
        <h2>Send Payment</h2>
        <form>
          <div className="form-group">
            <label htmlFor="recipientAddress">Recipient Address:</label>
            <input
              type="text"
              className="form-control"
              id="recipientAddress"
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
          <button type="submit" className="btn-primary">Send Payment</button>
        </form>
      </div>
    </div>
  );
};

export default SendPayments;