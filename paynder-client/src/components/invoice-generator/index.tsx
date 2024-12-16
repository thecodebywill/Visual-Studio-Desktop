import React, { useState, useEffect } from "react";
// import Web3 from "web3";
// import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";
import jsPDF from "jspdf";
// import { newKitFromWeb3 } from '@celo/contractkit';
import styles from "./invoice.module.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

const InvoiceGenerator = () => {
  // const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [invoiceOutput, setInvoiceOutput] = useState<any>(null);
  // const [kit, setKit] = useState<ContractKit | null>(null);

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
    // fetchNextInvoiceNumber();
  }, []);

  const checkWalletConnection = () => {
    const walletConnected = localStorage.getItem("walletConnected");
    if (walletConnected === "true") {
      const savedAccount = localStorage.getItem("account");
      setAccount(savedAccount);
    }
  };

  // const fetchNextInvoiceNumber = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://127.0.0.1:5000/api/get-next-invoice-number"
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setInvoiceData((prev) => ({
  //         ...prev,
  //         invoiceNumber: data.invoiceNumber,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching invoice number:", error);
  //   }
  // };

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

    setInvoiceOutput(invoicePayload);
    // try {
    //   const response = await fetch("http://127.0.0.1:5000/api/save-invoice", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(invoicePayload),
    //   });

    //   if (response.ok) {
    //     setInvoiceOutput(invoicePayload);
    //   } else {
    //     alert("Error saving invoice. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error saving invoice:", error);
    //   alert("Error saving invoice. Please try again.");
    // }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Invoice ${invoiceData.invoiceNumber}`,
        author: "Paynder Ltd",
        subject: "Invoice",
      });

      // Company Logo and Header
      doc.setFontSize(28);
      doc.setTextColor(241, 80, 26); // Orange brand color
      doc.text("PAYNDER", 20, 20);

      // Invoice Title
      doc.setFontSize(22);
      doc.setTextColor(33, 33, 33);
      doc.text("INVOICE", 20, 40);

      // Invoice Details Section
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);

      // Left column
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, 60);
      doc.text(`Date: ${invoiceData.date}`, 20, 70);
      doc.text(`Due Date: ${invoiceData.dueDate}`, 20, 80);

      // Right column
      doc.text(`Network: ${invoiceData.network}`, 120, 60);
      doc.text(`Stablecoin: ${invoiceData.stablecoin}`, 120, 70);

      // Description Box
      doc.setDrawColor(241, 80, 26);
      doc.setLineWidth(0.1);
      doc.rect(20, 90, 170, 30);
      doc.text("Description:", 25, 100);
      doc.setFontSize(11);
      doc.text(invoiceData.description, 25, 110);

      // Amount Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Amount Due: ${invoiceData.amount} ${invoiceData.stablecoin}`,
        120,
        140
      );

      // Payment Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Payment Details", 20, 160);
      doc.setFontSize(10);
      doc.text(`Wallet Address: ${account}`, 20, 170);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text("Paynder Ltd.", 20, 270);
      doc.text("Email: info@paynder.com | Website: www.paynder.com", 20, 280);

      // Save the PDF
      doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const shareWhatsApp = () => {
    const message = `🧾 *Invoice from Paynder*
  ───────────────
  *Invoice Number:* ${invoiceData.invoiceNumber}
  *Date:* ${invoiceData.date}
  *Due Date:* ${invoiceData.dueDate}
  
  *Description:*
  ${invoiceData.description}
  
  *Payment Details:*
  Amount: ${invoiceData.amount} ${invoiceData.stablecoin}
  Network: ${invoiceData.network}
  Wallet Address: ${account}
  
  Pay securely via Paynder 🔒
  www.paynder.com`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber} from Paynder`;

    const body = `Dear valued customer,
  
  Please find your invoice details below:
  
  INVOICE DETAILS
  ──────────────
  Invoice Number: ${invoiceData.invoiceNumber}
  Date: ${invoiceData.date}
  Due Date: ${invoiceData.dueDate}
  
  Description:
  ${invoiceData.description}
  
  PAYMENT INFORMATION
  ──────────────────
  Amount Due: ${invoiceData.amount} ${invoiceData.stablecoin}
  Network: ${invoiceData.network}
  Wallet Address: ${account}
  
  You can complete your payment securely through Paynder.
  
  For any questions, please contact us at support@paynder.com
  
  Best regards,
  Paynder Team
  www.paynder.com`;

    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
      "_blank"
    );
  };

  return (
    <div className={styles.productInterface}>
      <div className={styles.formContainer}>
        <h2 className={styles.formContainerHeading}>Create Invoice</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="invoiceNumber">
              Invoice Number
            </label>
            <input
              type="text"
              className={styles.formControl}
              id="invoiceNumber"
              // value={invoiceData.invoiceNumber}
              value="INV-2024-001"
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="date">
              Date
            </label>
            <input
              type="date"
              className={styles.formControl}
              id="date"
              value={invoiceData.date}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, date: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="date"
              className={styles.formControl}
              id="dueDate"
              value={invoiceData.dueDate}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, dueDate: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="description">
              Description
            </label>
            <input
              type="text"
              className={styles.formControl}
              id="description"
              value={invoiceData.description}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, description: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="stablecoin">
              Select Stablecoin
            </label>
            <select
              className={styles.formControlSelect}
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

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="network">
              Select Network
            </label>
            <select
              className={styles.formControlSelect}
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

          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="amount">
              Amount Due
            </label>
            <input
              type="number"
              className={styles.formControl}
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
        <div className={styles.modalOverlay}>
          <div className={styles.invoiceModal}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setInvoiceOutput(null)}
            >
              ×
            </button>
            <div className={styles.invoiceHeader}>
              <h3>Invoice Created Successfully</h3>
            </div>
            <div className={styles.invoiceContent}>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Invoice Number:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.invoiceNumber}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Date:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.date}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Due Date:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.dueDate}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Description:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.description}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Stablecoin:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.stablecoin}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Network:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.network}</span>
              </div>
              <div className={styles.invoiceDetail}>
                <span className={styles.invoiceDetailLabel}>Amount Due:</span>
                <span className={styles.invoiceDetailValue}>{invoiceOutput.amount}</span>
              </div>
            </div>
            <div className={styles.invoiceActions}>
              <button className="btn btn-primary" onClick={downloadPDF}>
                Download PDF
              </button>
              <button className="btn btn-success" onClick={shareWhatsApp}>
                Share via WhatsApp
              </button>
              <button className="btn btn-info" onClick={shareEmail}>
                Share via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
