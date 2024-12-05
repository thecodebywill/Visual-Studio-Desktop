import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";
// import { newKitFromWeb3 } from '@celo/contractkit';

declare global {
  interface Window {
    ethereum: any;
  }
}

const InvoiceGenerator = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [invoiceOutput, setInvoiceOutput] = useState<any>(null);
  const [kit, setKit] = useState<ContractKit | null>(null);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    description: "",
    stablecoin: "USDT",
    network: "Celo",
    amount: "",
  });

  useEffect(() => {
    checkWalletConnection();
    fetchNextInvoiceNumber();
  }, []);

  const checkWalletConnection = () => {
    const walletConnected = localStorage.getItem("walletConnected");
    if (walletConnected === "true") {
      const savedAccount = localStorage.getItem("account");
      setAccount(savedAccount);
    }
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/get-next-invoice-number"
      );
      if (response.ok) {
        const data = await response.json();
        setInvoiceData((prev) => ({
          ...prev,
          invoiceNumber: data.invoiceNumber,
        }));
      }
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your wallet before generating an invoice.");
      return;
    }

    const invoicePayload = {
      ...invoiceData,
      walletAddress: account,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/save-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicePayload),
      });

      if (response.ok) {
        setInvoiceOutput(invoicePayload);
      } else {
        alert("Error saving invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice. Please try again.");
    }
  };

  const downloadPDF = () => {
    // Implement PDF generation using jsPDF
  };

  const shareWhatsApp = () => {
    const message = `Invoice Details:\n\nInvoice Number: ${invoiceData.invoiceNumber}\nDate: ${invoiceData.date}\nDue Date: ${invoiceData.dueDate}\nDescription: ${invoiceData.description}\nStablecoin: ${invoiceData.stablecoin}\nNetwork: ${invoiceData.network}\nAmount Due: ${invoiceData.amount}\nWallet Address for Payment: ${account}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = "Invoice Details";
    const body = `Invoice Details:\n\nInvoice Number: ${invoiceData.invoiceNumber}\nDate: ${invoiceData.date}\nDue Date: ${invoiceData.dueDate}\nDescription: ${invoiceData.description}\nStablecoin: ${invoiceData.stablecoin}\nNetwork: ${invoiceData.network}\nAmount Due: ${invoiceData.amount}\nWallet Address for Payment: ${account}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
      "_blank"
    );
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
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, date: e.target.value })
              }
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
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, dueDate: e.target.value })
              }
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
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stablecoin">Select Stablecoin</label>
            <select
              className="form-control"
              id="stablecoin"
              value={invoiceData.stablecoin}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, stablecoin: e.target.value })
              }
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
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, network: e.target.value })
              }
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
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, amount: e.target.value })
              }
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Generate Invoice
          </button>
        </form>
      </div>

      {invoiceOutput && (
        <div className="invoice-output">
          <h3>Invoice Created</h3>
          <p>Invoice Number: {invoiceOutput.invoiceNumber}</p>
          <p>Date: {invoiceOutput.date}</p>
          <p>Due Date: {invoiceOutput.dueDate}</p>
          <p>Description: {invoiceOutput.description}</p>
          <p>Stablecoin: {invoiceOutput.stablecoin}</p>
          <p>Network: {invoiceOutput.network}</p>
          <p>Amount Due: {invoiceOutput.amount}</p>
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={shareWhatsApp}>Share via WhatsApp</button>
          <button onClick={shareEmail}>Share via Email</button>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;


