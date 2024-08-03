let web3;
let userAccount;

document.addEventListener("DOMContentLoaded", function() {
    const connectWalletButton = document.getElementById("connectWalletButton");
    const sendPaymentForm = document.getElementById("sendPaymentForm");
    const paymentLinkForm = document.getElementById("paymentLinkForm");

    // Function to update button text based on connection status
    function updateButtonText() {
        const account = localStorage.getItem('account');
        if (account) {
            connectWalletButton.innerText = `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        } else {
            connectWalletButton.innerText = "Connect Wallet";
        }
    }

    // Function to disconnect the wallet
    function disconnectWallet() {
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('account');
        web3 = null;
        userAccount = null;
        updateButtonText();
    }

    // Function to initialize web3 and account
    async function initializeWeb3() {
        if (localStorage.getItem('walletConnected') === 'true') {
            const account = localStorage.getItem('account');
            if (typeof window.ethereum !== 'undefined') {
                web3 = new Web3(window.ethereum);
                userAccount = account;
                updateButtonText();
            } else {
                alert('Please install MetaMask or another Web3 wallet provider.');
                disconnectWallet();
            }
        }
    }

    // Initialize web3 on page load
    initializeWeb3();

    // Connect or disconnect wallet on button click
    connectWalletButton.addEventListener('click', async function() {
        if (localStorage.getItem('walletConnected') === 'true') {
            disconnectWallet();
        } else {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const account = accounts[0];
                    localStorage.setItem('walletConnected', 'true');
                    localStorage.setItem('account', account);
                    web3 = new Web3(window.ethereum);
                    userAccount = account;
                    updateButtonText();
                } catch (error) {
                    console.error('User denied account access or error occurred:', error);
                }
            } else {
                alert('Please install MetaMask or another Web3 wallet provider.');
            }
        }
    });

    // Handle payment link generation
    if (paymentLinkForm) {
        paymentLinkForm.addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const linkDescription = document.getElementById("linkDescription").value;
            const stablecoin = document.getElementById("stablecoin").value;
            const network = document.getElementById("network").value;
            const amount = document.getElementById("amount").value;
    
            // Ensure wallet is connected
            if (!web3 || !userAccount) {
                alert("Please connect your wallet first.");
                return;
            }
    
            try {
                // Implement your link generation logic here
                const paymentLink = `payment.html?desc=${encodeURIComponent(linkDescription)}&coin=${encodeURIComponent(stablecoin)}&network=${encodeURIComponent(network)}&amount=${encodeURIComponent(amount)}&recipient=${encodeURIComponent(userAccount)}`;
                const outputElement = document.getElementById("paymentLinkOutput");
                outputElement.innerHTML = `<p>Payment Link Generated: <a href="${paymentLink}" target="_blank">${paymentLink}</a></p>`;
                outputElement.style.display = "block";
            } catch (error) {
                console.error("Link generation failed:", error);
                alert("Link generation failed. Please try again.");
            }
        });
    }

    // Handle send payment
    if (sendPaymentForm) {
        sendPaymentForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const recipientAddress = document.getElementById("recipientAddress").value || userAccount; // Use connected wallet address if not provided
            const stablecoin = document.getElementById("stablecoin").value;
            const network = document.getElementById("network").value;
            const amount = document.getElementById("amount").value;

            // Ensure wallet is connected
            if (!web3 || !userAccount) {
                alert("Please connect your wallet first.");
                return;
            }

            try {
                if (network === 'Celo') {
                    await sendCeloPayment(recipientAddress, stablecoin, amount);
                } else if (network === 'Lightning') {
                    await sendLightningPayment(recipientAddress, stablecoin, amount);
                } else {
                    throw new Error('Unsupported network');
                }
                alert("Payment sent successfully.");
            } catch (error) {
                console.error("Payment failed:", error);
                alert(`Payment failed: ${error.message}`);
            }
        });
    }

    async function sendCeloPayment(recipientAddress, stablecoin, amount) {
        // Stablecoin contract addresses and ABI (replace with actual data)
        const stablecoinAddresses = {
            "USDT": "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e",
            "USDC": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
            "cUSD": "0x765de816845861e75a25fca122bb6898b8b1282a"
        };
        const stablecoinAddress = stablecoinAddresses[stablecoin];
        const contractABI = [
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{"name": "", "type": "uint8"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {"name": "_to", "type": "address"},
                    {"name": "_value", "type": "uint256"}
                ],
                "name": "transfer",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {"name": "_owner", "type": "address"}
                ],
                "name": "balanceOf",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ];
        const contract = new web3.eth.Contract(contractABI, stablecoinAddress);
    
        // Get the decimals for the stablecoin
        const decimals = await contract.methods.decimals().call();
        const amountInWei = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));
    
        const tx = {
            from: userAccount,  // Ensure this field is set
            to: stablecoinAddress,
            data: contract.methods.transfer(recipientAddress, amountInWei).encodeABI(),
            gas: 2000000,
            gasPrice: web3.utils.toWei('5', 'gwei')
        };
    
        await web3.eth.sendTransaction(tx);
    }
    async function sendLightningPayment(recipientAddress, stablecoin, amount) {
        // Implement your Lightning Network payment logic here
        // Example: Make a POST request to your Flask backend
        const response = await fetch('/pay_invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoice_id: recipientAddress, // assuming recipientAddress is the invoice_id for Lightning payments
                network: 'Lightning',
                wallet_address: recipientAddress,
                amount: amount
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Unknown error');
        }
        return data;
    }

    // API CALL FOR PAY INVOICE
    async function payInvoice() {
        const paymentData = {
            invoice_id: document.getElementById('invoiceID').value, // ID of the invoice
            wallet_address: document.getElementById('walletAddress').value,
            network: document.getElementById('network').value,
            amount: document.getElementById('amount').value,
        };

        const response = await fetch('/pay_invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Payment successful for Invoice ID: ${result.invoice_id}`);
        } else {
            alert(result.error);
        }
    }

    // Add event listener to the payment form submission
    document.getElementById('sendPaymentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        payInvoice();
    });
});
