import { newKit } from "@celo/contractkit";
// import Web3 from "web3";

export const connectWallet = async (eth: any) => {
  try {
    const accounts = await eth.request({
      method: "eth_accounts",
    });

    const currentAccount = accounts[0];

    const kit = newKit("https://alfajores-forno.celo-testnet.org");

    kit.defaultAccount = currentAccount;

    localStorage.setItem("walletConnected", "true");
    localStorage.setItem("account", currentAccount);

    console.log({
      currentAccount,
      kit,
    });

    return currentAccount;
  } catch (error) {
    console.log("Detailed connection error:", error);
  }
};

// const switchToCeloNetwork = async () => {
//   try {
//     await window.ethereum.request({
//       method: "wallet_addEthereumChain",
//       params: [
//         {
//           chainId: "0xa4ec",
//           chainName: "Celo Mainnet",
//           nativeCurrency: {
//             name: "CELO",
//             symbol: "CELO",
//             decimals: 18,
//           },
//           rpcUrls: ["https://forno.celo.org"],
//           blockExplorerUrls: ["https://explorer.celo.org"],
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("Error switching to Celo network:", error);
//   }
// };
