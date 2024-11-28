import React, { useState } from 'react';
import Web3 from 'web3';
import { ContractKit } from '@celo/contractkit';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    stablecoin: 'USDT',
    network: 'Celo',
    amount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Invoice generation logic will go here
  };

  return (
    <div className="product-interface">
      <div className="form-container">
        <h2>Create Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number</label>
            <input
              type="text"
              className="form-control"
              id="invoiceNumber"
              value={invoiceData.invoiceNumber}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={invoiceData.date}
              onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={invoiceData.description}
              onChange={(e) => setInvoiceData({...invoiceData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stablecoin">Select Stablecoin</label>
            <select
              className="form-control"
              id="stablecoin"
              value={invoiceData.stablecoin}
              onChange={(e) => setInvoiceData({...invoiceData, stablecoin: e.target.value})}
              required
            >
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="cUSD">cUSD</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="network">Select Network</label>
            <select
              className="form-control"
              id="network"
              value={invoiceData.network}
              onChange={(e) => setInvoiceData({...invoiceData, network: e.target.value})}
              required
            >
              <option value="Celo">Celo Network</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount Due</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={invoiceData.amount}
              onChange={(e) => setInvoiceData({...invoiceData, amount: e.target.value})}
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Generate Invoice</button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
