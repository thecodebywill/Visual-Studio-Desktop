"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./dashboard.module.css";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Coins,
  Building,
  CreditCard,
  Link,
  Copy,
} from "lucide-react";
import { MetaMaskInpageProvider } from "@metamask/providers";
// import { newKit } from "@celo/contractkit";

export default function DashboardPage() {
  const [balance, _setBalance] = useState(10000.0);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("crypto");
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [eth, setEth] = useState<MetaMaskInpageProvider>();
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setEth(window.ethereum);
    }

    console.log(window.ethereum);
  }, []);

  const handleConnectWallet = useCallback(async () => {
    if (!eth) return;

    try {
      const result = await eth.request<`0x${string}`[]>({
        method: "eth_accounts",
      });

      if (
        !result ||
        !result.length ||
        !result[0] ||
        !result[0].startsWith("0x")
      )
        throw new Error("Could not connect wallet.");

      //     const kit = newKit("https://alfajores-forno.celo-testnet.org");
      //   console.log({ kit });

      //   kit.defaultAccount = result[0]!;

      setWalletId(result[0]);
    } catch (error) {
      console.error("our error", error);
    }
  }, [eth]);

  //   // Replace the existing connectWallet function with:
  //   const handleWalletConnect = async (eth: any) => {
  //     try {
  //       const savedAccount = await connectWallet(eth);
  //       if (savedAccount) {
  //         setwalletId(true);
  //         setWalletId(savedAccount || "");
  //         showToast("Wallet Connected", "success");
  //       } else {
  //         throw new Error();
  //       }
  //     } catch (error) {
  //       console.error("Failed to connect wallet:", error);
  //       showToast("Failed to connect wallet. Please try again.", "error");
  //     }
  //   };

  const disconnectWallet = () => {
    setWalletId(null);
    setWalletId("");
    localStorage.removeItem("walletId");
    showToast("Wallet Disconnected", "success");
  };

  const copyWalletId = () => {
    if (walletId) {
      navigator.clipboard.writeText(walletId);
      showToast("Wallet ID Copied", "success");
    }
  };

  const showToast = (message: string, type: string) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Paynder</h1>
          <div className={styles.headerActions}>
            {walletId ? (
              <div
                className={styles.walletButton}
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
              >
                <Wallet className={styles.icon} />
                {walletId.slice(0, 6)}...{walletId.slice(-4)}
                {showWalletDropdown && (
                  <div className={styles.walletDropdown}>
                    <div
                      className={styles.walletDropdownItem}
                      onClick={() => {
                        copyWalletId();
                      }}
                    >
                      <Copy className={styles.icon} />
                      Copy Wallet ID
                    </div>
                    <div
                      className={styles.walletDropdownItem}
                      onClick={() => {
                        disconnectWallet();
                      }}
                    >
                      <Link className={styles.icon} />
                      Disconnect Wallet
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={styles.walletButton}
                onClick={handleConnectWallet}
              >
                <Wallet className={styles.icon} />
                Connect Wallet
              </button>
            )}
            <div className={styles.avatar}></div>
          </div>
        </header>

        <div className={styles.gridContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Wallet Balance</h2>
            </div>
            <div className={styles.balanceAmount}>
              ${balance.toFixed(2)} USDC
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                disabled={!walletId}
              >
                <ArrowDownRight className={styles.icon} /> Add Funds
              </button>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={!walletId}
              >
                <ArrowUpRight className={styles.icon} /> Withdraw
              </button>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            <button className={styles.actionButton} disabled={!walletId}>
              <ArrowUpRight className={styles.icon} /> Send Money
            </button>
            <div className={styles.dropdownWrapper}>
              <button
                className={`${styles.actionButton} ${showReceiveDropdown ? styles.active : ""}`}
                disabled={!walletId}
                onClick={() => setShowReceiveDropdown(!showReceiveDropdown)}
              >
                <ArrowDownRight className={styles.icon} /> Receive Crypto
              </button>

              {showReceiveDropdown && (
                <div className={styles.receiveDropdown}>
                  <button
                    className={styles.receiveOption}
                    onClick={() => {
                      /* handle payment link */
                    }}
                  >
                    <Link className={styles.icon} /> Generate Payment Link
                  </button>
                  <button
                    className={styles.receiveOption}
                    onClick={() => {
                      /* handle invoice */
                    }}
                  >
                    <FileText className={styles.icon} /> Generate Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Payment Methods</h2>
            </div>
            <div className={styles.tabs}>
              <div
                className={`${styles.tab} ${activeTab === "crypto" ? styles.active : ""}`}
                onClick={() => setActiveTab("crypto")}
              >
                Crypto
              </div>
              <div
                className={`${styles.tab} ${activeTab === "fiat" ? styles.active : ""}`}
                onClick={() => setActiveTab("fiat")}
              >
                Fiat
              </div>
            </div>
            <div
              className={`${styles.tabContent} ${activeTab === "crypto" ? styles.active : ""}`}
            >
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <Coins className={styles.icon} /> USDC
                </li>
                <li className={styles.listItem}>
                  <Coins className={styles.icon} /> USDT
                </li>
                <li className={styles.listItem}>
                  <Coins className={styles.icon} /> DAI
                </li>
              </ul>
            </div>
            <div
              className={`${styles.tabContent} ${activeTab === "fiat" ? styles.active : ""}`}
            >
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <CreditCard className={styles.icon} /> Credit Card
                </li>
                <li className={styles.listItem}>
                  <Building className={styles.icon} /> Bank Transfer
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Transactions</h2>
            </div>
            <ul className={styles.list}>
              <li className={styles.transactionItem}>
                <span>
                  <ArrowUpRight
                    className={`${styles.transactionIcon} ${styles.sent}`}
                  />{" "}
                  To Acme Corp
                </span>
                <span className={styles.sent}>-5000.00 USDC</span>
              </li>
              <li className={styles.transactionItem}>
                <span>
                  <ArrowDownRight
                    className={`${styles.transactionIcon} ${styles.received}`}
                  />{" "}
                  From Client XYZ
                </span>
                <span className={styles.received}>+10000.00 USDC</span>
              </li>
              <li className={styles.transactionItem}>
                <span>
                  <ArrowUpRight
                    className={`${styles.transactionIcon} ${styles.sent}`}
                  />{" "}
                  To Employee Payroll
                </span>
                <span className={styles.sent}>-2500.00 USDC</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {toast.show && (
        <div
          className={`${styles.toast} ${styles.toast} ${
            toast.type === "success" ? styles.toastSuccess : styles.toastError
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
