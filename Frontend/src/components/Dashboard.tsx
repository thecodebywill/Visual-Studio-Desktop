// Future imports for functionality:
// import { ethers } from 'ethers';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { verifyToken, loadUserDetails } from './utils/authUtils';
// import { loadInvoiceActivities, loadPaymentLinks } from './utils/dashboardUtils';
// import { contracts } from './constants/contracts';
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="product-interface">
      <div className="btn-group mb-3" role="group" aria-label="Section Toggle">
        <button type="button" className="btn btn-secondary active" data-section="invoiceActivities">Invoice Activities</button>
        <button type="button" className="btn btn-secondary" data-section="paymentLinks">Payment Links</button>
        <button type="button" className="btn btn-secondary" data-section="walletBalance">Wallet Balance</button>
        <button type="button" className="btn btn-secondary" data-section="onRampOffRampActivities">On-Ramp/Off-Ramp Activities</button>
      </div>

      <div id="invoiceActivities" className="section">
        <h2>Invoice Activities</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Expiration Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <div id="paymentLinks" className="section">
        <h2>Payment Links</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Payment Link</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <div id="walletBalance" className="section">
        <h2>Wallet Balance</h2>
        <div id="walletBalances">
          <p id="cusdBalance">CUSD Balance: Loading...</p>
          <p id="usdtBalance">USDT Balance: Loading...</p>
          <p id="usdcBalance">USDC Balance: Loading...</p>
        </div>
      </div>

      <div id="onRampOffRampActivities" className="section">
        <h2>On-Ramp/Off-Ramp Activities</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      {/* Account Modal */}
      <div className="modal fade" id="accountModal" tabIndex={-1} role="dialog" aria-labelledby="accountModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="accountModalLabel">Account Details</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form id="updateProfileForm">
                <div className="form-group">
                  <label htmlFor="usernameInput">Username</label>
                  <input type="text" className="form-control" id="usernameInput" disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="emailInput">Email</label>
                  <input type="email" className="form-control" id="emailInput" disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="walletStatusInput">Wallet Status</label>
                  <input type="text" className="form-control" id="walletStatusInput" disabled />
                </div>
                <button type="button" id="updateProfileButton" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" id="connectWalletButton" className="btn btn-primary">Connect Wallet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
