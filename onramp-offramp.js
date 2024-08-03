let web3;
let account;

// ABI for the stablecoin contract
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

//ID issue
const stablecoinMapping = {
    "cusd": "cUSD",
    "usd-coin": "USDC",
    "tether": "USDT"
};

// Load Web3 and handle wallet connection
window.onload = async function() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await checkWalletConnection();
    } else {
        alert('Please install MetaMask or another Web3 wallet provider.');
    }

    // Toggle buttons functionality
    document.getElementById('onRampButton').addEventListener('click', function() {
        document.getElementById('onRampFormContainer').style.display = 'block';
        document.getElementById('offRampFormContainer').style.display = 'none';
        document.getElementById('onRampButton').classList.add('active');
        document.getElementById('offRampButton').classList.remove('active');
    });

    document.getElementById('offRampButton').addEventListener('click', function() {
        document.getElementById('onRampFormContainer').style.display = 'none';
        document.getElementById('offRampFormContainer').style.display = 'block';
        document.getElementById('offRampButton').classList.add('active');
        document.getElementById('onRampButton').classList.remove('active');
    });

    // Connect wallet button functionality
    document.getElementById('connectWalletButton').addEventListener('click', async function() {
        if (localStorage.getItem('walletConnected') === 'true') {
            disconnectWallet();
        } else {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                account = accounts[0];
                localStorage.setItem('walletConnected', 'true');
                localStorage.setItem('account', account);
                updateButtonText();
            } catch (error) {
                console.error('User denied account access or error occurred:', error);
                alert('Error connecting wallet. Please try again.');
            }
        }
    });
};
// Display On-Ramp section by default
document.getElementById('onRampFormContainer').style.display = 'block';
document.getElementById('offRampFormContainer').style.display = 'none';
document.getElementById('onRampButton').classList.add('active');
document.getElementById('offRampButton').classList.remove('active');
;


// Check if wallet is already connected
async function checkWalletConnection() {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
        account = localStorage.getItem('account');
        updateButtonText();
    } else {
        updateButtonText();
    }
}

// Update button text based on connection status
function updateButtonText() {
    const accountElement = document.getElementById('connectWalletButton');
    if (account) {
        accountElement.innerText = `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
    } else {
        accountElement.innerText = "Connect Wallet";
    }
}

// Disconnect wallet function
function disconnectWallet() {
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('account');
    web3 = null;
    account = null;
    updateButtonText();
}

// On-ramp functionality
// On-ramp functionality
document.getElementById('onRampForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const stablecoin = document.getElementById('onRampStablecoin').value;
    const amount = document.getElementById('onRampAmount').value;
    const mpesaNumber = document.getElementById('mpesaNumber').value;

    if (!account) {
        alert('Please connect your wallet first.');
        return;
    }

    try {
        // Define stablecoin contract addresses
        const stablecoinAddresses = {
            "USDT": "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e",
            "USDC": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
            "cUSD": "0x765de816845861e75a25fca122bb6898b8b1282a"
        };
        const stablecoinAddress = stablecoinAddresses[stablecoin];
        
        if (!stablecoinAddress) {
            alert('Invalid stablecoin selected.');
            return;
        }
        
        const contract = new web3.eth.Contract(contractABI, stablecoinAddress);

        // Get the decimals for the stablecoin
        const decimals = await contract.methods.decimals().call();
        const amountInWei = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));
        console.log(`Amount in Wei: ${amountInWei.toString()}`);

        const tx = {
            from: account,
            to: stablecoinAddress,
            data: contract.methods.transfer(account, amountInWei).encodeABI(),
            gas: 2000000,
            gasPrice: web3.utils.toWei('5', 'gwei')
        };

        await web3.eth.sendTransaction(tx);

        // Notify the user
        alert('On-ramp successful!');
        
        // Optionally, you could also send the request to your backend here
        const response = await fetch('/on_ramp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stablecoin: stablecoin,
                amount: amount,
                mpesaNumber: mpesaNumber,
                walletAddress: account
            }),
        });
        
        const result = await response.json();
        if (!result.success) {
            alert('On-ramp failed. Please try again.');
        }

    } catch (error) {
        console.error('Error during on-ramp:', error);
        alert(`On-ramp failed: ${error.message || 'Unknown error'}`);
    }
});



//Crypto prices 
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
    const apiKey = 'b198798d-aa0e-4f44-8be0-eecd59f1db98';
    const url = 'http://127.0.0.1:5000/api/price/';
    const stablecoinSymbols = {
        'cusd': 'cusd',
        'usd-coin': 'usdc',
        'tether': 'usdt'
    };

    async function fetchPrice(tokenSymbol) {
        console.log(`Fetching price for symbol: ${tokenSymbol}`);
        try {
            const response = await fetch(`${url}${tokenSymbol}?apiKey=${apiKey}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status); // Debugging response status

            if (response.ok) {
                const data = await response.json();
                console.log('Price data:', data);
                return data;
            } else {
                console.error('Failed to fetch price data:', response.statusText);
                return { error: 'Failed to fetch price data' };
            }
        } catch (error) {
            console.error('Error fetching price data:', error);
            return { error: 'Failed to fetch price data' };
        }
    }

    function updatePriceDisplay(prices, formId) {
        console.log('Updating price display:', prices, formId);
        const pricePreviewId = formId === 'onRamp' ? 'onRampPricePreview' : 'offRampPricePreview';

        if (prices.error) {
            document.getElementById(pricePreviewId).value = prices.error;
            return;
        }

        const { buy_price, sell_price } = prices;
        if (formId === 'onRamp') {
            document.getElementById(pricePreviewId).value = `Buy Price: KES ${buy_price.toFixed(2)}`;
        } else {
            document.getElementById(pricePreviewId).value = `Sell Price: KES ${sell_price.toFixed(2)}`;
        }
    }

    async function initializePriceDisplays() {
        const onRampSelect = document.getElementById('onRampStablecoin');
        const offRampSelect = document.getElementById('offRampStablecoin');
        const onRampSymbol = stablecoinSymbols[onRampSelect.value.toLowerCase()];
        const offRampSymbol = stablecoinSymbols[offRampSelect.value.toLowerCase()];

        if (onRampSymbol) {
            const onRampPrices = await fetchPrice(onRampSymbol);
            updatePriceDisplay(onRampPrices, 'onRamp');
        }

        if (offRampSymbol) {
            const offRampPrices = await fetchPrice(offRampSymbol);
            updatePriceDisplay(offRampPrices, 'offRamp');
        }
    }

    document.getElementById('onRampStablecoin').addEventListener('change', async () => {
        const stablecoinSelectId = 'onRampStablecoin';
        const selectedSymbol = document.getElementById(stablecoinSelectId).value.toLowerCase();
        const tokenSymbol = stablecoinSymbols[selectedSymbol];

        console.log(`On-Ramp Stablecoin selection changed. Selected Symbol: ${selectedSymbol}, Token Symbol: ${tokenSymbol}`);

        if (tokenSymbol) {
            const prices = await fetchPrice(tokenSymbol);
            updatePriceDisplay(prices, 'onRamp');
        } else {
            document.getElementById('onRampPricePreview').value = 'Invalid token symbol';
        }
    });

    document.getElementById('offRampStablecoin').addEventListener('change', async () => {
        const stablecoinSelectId = 'offRampStablecoin';
        const selectedSymbol = document.getElementById(stablecoinSelectId).value.toLowerCase();
        const tokenSymbol = stablecoinSymbols[selectedSymbol];

        console.log(`Off-Ramp Stablecoin selection changed. Selected Symbol: ${selectedSymbol}, Token Symbol: ${tokenSymbol}`);

        if (tokenSymbol) {
            const prices = await fetchPrice(tokenSymbol);
            updatePriceDisplay(prices, 'offRamp');
        } else {
            document.getElementById('offRampPricePreview').value = 'Invalid token symbol';
        }
    });

    initializePriceDisplays();
});

// Off-ramp functionality
document.getElementById('offRampForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const stablecoin = document.getElementById('offRampStablecoin').value;
    const amount = document.getElementById('offRampAmount').value;
    const phoneNumber = document.getElementById('sendToPhoneNumber').value;

    if (!account) {
        alert('Please connect your wallet first.');
        return;
    }

    // Define stablecoin contract addresses
    const stablecoinAddresses = {
        "cusd": "0x765de816845861e75a25fca122bb6898b8b1282a",
    "usd-coin": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    "tether": "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e"
    };
    const stablecoinAddress = stablecoinAddresses[stablecoin];
    
    if (!stablecoinAddress) {
        alert('Invalid stablecoin selected.');
        return;
    }

    const contract = new web3.eth.Contract(contractABI, stablecoinAddress);

    try {
        const decimals = await contract.methods.decimals().call();
        const amountInWei = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));
        console.log(`Amount in Wei: ${amountInWei.toString()}`);

        // Transaction parameters (for tokens, you might want to use 'transfer' function instead)
        const tx = {
            from: account,
            to: stablecoinAddress,
            data: contract.methods.transfer(account, amountInWei).encodeABI(),
            gas: 2000000,
            gasPrice: web3.utils.toWei('5', 'gwei')
        };

        await web3.eth.sendTransaction(tx);

        alert('Off-ramp successful!');
        
        // Optionally, you could also send the request to your backend here
        const response = await fetch('/off_ramp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stablecoin: stablecoin,
                amount: amount,
                phoneNumber: phoneNumber,
                walletAddress: account
            }),
        });

        const result = await response.json();
        if (!result.success) {
            alert('Off-ramp failed. Please try again.');
        }

    } catch (error) {
        console.error('Error during off-ramp:', error);
        alert(`Off-ramp failed: ${error.message || 'Unknown error'}`);
    }
});
