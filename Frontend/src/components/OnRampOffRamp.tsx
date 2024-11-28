// Future imports for functionality:
// import Web3 from 'web3';
// import { useWeb3 } from './hooks/useWeb3';
// import { handleOnRamp, handleOffRamp } from './utils/rampUtils';
import React, { useState } from 'react';

const OnRampOffRamp: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'onramp' | 'offramp'>('onramp');

  return (
    <div className="product-interface">
      <div className="form-container">
        <div className="toggle-buttons">
          <button 
            className={`btn ${activeForm === 'onramp' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveForm('onramp')}
          >
            On-Ramp
          </button>
          <button 
            className={`btn ${activeForm === 'offramp' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveForm('offramp')}
          >
            Off-Ramp
          </button>
        </div>

        {activeForm === 'onramp' ? (
          <div className="form-container">
            <h2>On-Ramp</h2>
            <form id="onRampForm">
              <div className="form-group">
                <label htmlFor="onRampStablecoin">Select Stablecoin:</label>
                <select className="form-control" id="onRampStablecoin" required>
                  <option value="cusd">CUSD</option>
                  <option value="usd-coin">USDC</option>
                  <option value="tether">USDT</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="onRampAmount">Amount:</label>
                <input type="number" className="form-control" id="onRampAmount" step="0.01" required />
              </div>
              <div className="form-group">
                <label htmlFor="onRampPaymentMethod">Payment Method:</label>
                <input type="text" className="form-control" id="onRampPaymentMethod" value="MPESA" readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="onRampPricePreview">Price in KES:</label>
                <input type="text" className="form-control" id="onRampPricePreview" readOnly />
              </div>
              <button type="submit" className="btn-primary">Buy Stablecoin</button>
            </form>
          </div>
        ) : (
          <div className="form-container">
            <h2>Off-Ramp</h2>
            <form id="offRampForm">
              <div className="form-group">
                <label htmlFor="offRampStablecoin">Select Stablecoin:</label>
                <select className="form-control" id="offRampStablecoin" required>
                  <option value="cusd">CUSD</option>
                  <option value="usd-coin">USDC</option>
                  <option value="tether">USDT</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="offRampAmount">Amount:</label>
                <input type="number" className="form-control" id="offRampAmount" step="0.01" required />
              </div>
              <div className="form-group">
                <label htmlFor="offRampReceivingMethod">Receiving Method:</label>
                <input type="text" className="form-control" id="offRampReceivingMethod" value="MPESA" readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="sendToPhoneNumber">Send Money To Phone Number:</label>
                <input type="text" className="form-control" id="sendToPhoneNumber" required />
              </div>
              <div className="form-group">
                <label htmlFor="offRampPricePreview">Price in KES:</label>
                <input type="text" className="form-control" id="offRampPricePreview" readOnly />
              </div>
              <button type="submit" className="btn-primary">Sell Stablecoin</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnRampOffRamp;