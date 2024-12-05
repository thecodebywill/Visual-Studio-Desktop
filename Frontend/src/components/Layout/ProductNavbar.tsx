import { newKitFromWeb3 } from "@celo/contractkit";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Web3 from "web3";

const ProductNavbar = () => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        await switchToCeloNetwork();

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        const currentAccount = accounts[0];
        const provider = window.ethereum;
        const web3Instance = new Web3(provider);
        const kitInstance = newKitFromWeb3(web3Instance);

        kitInstance.defaultAccount = currentAccount;

        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("account", currentAccount);

        console.log({
          currentAccount,
          web3Instance,
          kitInstance,
        })
      } catch (error) {
        console.log("Detailed connection error:", error);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet provider.");
    }
  };

  const switchToCeloNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xa4ec',
          chainName: 'Celo Mainnet',
          nativeCurrency: {
            name: 'CELO',
            symbol: 'CELO',
            decimals: 18
          },
          rpcUrls: ['https://forno.celo.org'],
          blockExplorerUrls: ['https://explorer.celo.org']
        }]
      });
    } catch (error) {
      console.error('Error switching to Celo network:', error);
    }
  };

  return (
    <nav className="product-nav">
      <Link to="/" className="logo">
        Paynder
      </Link>
      <ul>
        <li>
          <Link to="/invoice">Create Invoice</Link>
        </li>
        <li>
          <Link to="/send">Send</Link>
        </li>
        <li>
          <Link to="/links">Links</Link>
        </li>
        <li>
          <Link to="/onramp">On-Ramp & Off-Ramp</Link>
        </li>
        {/* <li><Link to="/dashboard">Dashboard</Link></li> */}
      </ul>
      <button
        type="button"
        className="btn btn-primary"
        id="connectWalletButton"
        onClick={() => connectWallet()}
      >
        Connect Wallet
      </button>
    </nav>
  );
};

export default ProductNavbar;
