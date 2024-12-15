const { ethers } = window;

window.onload = async function() {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token);

    if (!token) {
        console.warn('No token found. Redirecting to login page.');
        window.location.href = 'login.html'; // Redirect to login if token is not found
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/verify_token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const responseBody = await response.text();
            console.warn('Token verification failed. Response status:', response.status);
            console.warn('Response body:', responseBody);
            window.location.href = 'login.html'; // Redirect to login if token is invalid
            return;
        }

        // If token is valid, proceed with loading activities
        await loadInvoiceActivities();
        await loadPaymentLinks();
        await loadWalletBalance();
        await loadOnRampOffRampActivities();
    } catch (error) {
        console.error('Error verifying token:', error);
        window.location.href = 'login.html'; // Redirect to login if error occurs
    }
};

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

const contracts = {
    CUSD: { address: '0x765de816845861e75a25fca122bb6898b8b1282a', abi: contractABI },
    USDT: { address: '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e', abi: contractABI },
    USDC: { address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', abi: contractABI }
};

async function loadInvoiceActivities() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_invoices', { method: 'GET' });
        if (!response.ok) throw new Error('Network response was not ok');
        const invoices = await response.json();
        console.log('Invoices:', invoices);

        const invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
        invoiceTable.innerHTML = '';

        invoices.forEach(invoice => {
            const row = invoiceTable.insertRow();
            row.insertCell(0).innerText = invoice.invoice_id;
            row.insertCell(1).innerText = new Date(invoice.expiration).toLocaleDateString();
            row.insertCell(2).innerText = invoice.description;
            row.insertCell(3).innerText = invoice.amount;
            row.insertCell(4).innerText = invoice.status;
        });
    } catch (error) {
        console.error('Error loading invoice activities:', error);
    }
}

async function loadPaymentLinks() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_payment_links', { method: 'GET' });
        if (!response.ok) throw new Error('Network response was not ok');
        const paymentLinks = await response.json();
        console.log('Payment Links:', paymentLinks);

        const paymentLinkTable = document.getElementById('paymentLinkTable').getElementsByTagName('tbody')[0];
        paymentLinkTable.innerHTML = '';

        paymentLinks.forEach(link => {
            const row = paymentLinkTable.insertRow();
            row.insertCell(0).innerText = link.invoice_id;
            row.insertCell(1).innerHTML = `<a href="${link.payment_link}" target="_blank">${link.payment_link}</a>`;
        });
    } catch (error) {
        console.error('Error loading payment links:', error);
    }
}

async function loadWalletBalance() {
    try {
        const ethereum = window.ethereum;
        if (!ethereum) {
            console.error('MetaMask is not installed.');
            return;
        }

        await ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        if (!account) {
            console.error('No account connected.');
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);

        for (const [token, { address, abi }] of Object.entries(contracts)) {
            try {
                const contract = new ethers.Contract(address, abi, provider);
                const balance = await contract.balanceOf(account);
                const decimals = await contract.decimals();
                document.getElementById(`${token.toLowerCase()}Balance`).innerText = `${token} Balance: ${ethers.utils.formatUnits(balance, decimals)} ${token}`;
            } catch (error) {
                console.error(`Error fetching ${token} balance:`, error);
                document.getElementById(`${token.toLowerCase()}Balance`).innerText = `${token} Balance: Error`;
            }
        }
    } catch (error) {
        console.error('Error loading wallet balance:', error);
    }
}

async function loadOnRampOffRampActivities() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_on_ramp_off_ramp_activities', { method: 'GET' });
        if (!response.ok) throw new Error('Network response was not ok');
        const activities = await response.json();
        console.log('On-Ramp/Off-Ramp Activities:', activities);

        const table = document.getElementById('onRampOffRampTable').getElementsByTagName('tbody')[0];
        table.innerHTML = '';

        activities.forEach(activity => {
            const row = table.insertRow();
            row.insertCell(0).innerText = activity.type;
            row.insertCell(1).innerText = new Date(activity.date).toLocaleDateString();
            row.insertCell(2).innerText = activity.amount;
            row.insertCell(3).innerText = activity.status;
        });
    } catch (error) {
        console.error('Error loading on-ramp/off-ramp activities:', error);
    }
}

document.getElementById('accountButton').addEventListener('click', function() {
    $('#accountModal').modal('show');
    loadUserDetails();
    loadWalletStatus();
});

async function loadUserDetails() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/user_details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user details');
        const user = await response.json();

        document.getElementById('usernameInput').value = user.username;
        document.getElementById('emailInput').value = user.email;
    } catch (error) {
        console.error('Error loading user details:', error);
    }
}

async function loadWalletStatus() {
    try {
        const ethereum = window.ethereum;
        if (!ethereum) {
            console.error('MetaMask is not installed.');
            return;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const walletStatus = accounts.length > 0 ? 'Connected' : 'Not Connected';
        document.getElementById('walletStatusInput').value = walletStatus;
    } catch (error) {
        console.error('Error loading wallet status:', error);
    }
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'login.html'; // Redirect to login page after logout
});

document.getElementById('connectWalletButton').addEventListener('click', async function() {
    const walletStatus = document.getElementById('walletStatusInput').value;
    const ethereum = window.ethereum;

    if (!ethereum) {
        console.error('MetaMask is not installed.');
        return;
    }

    try {
        if (walletStatus === 'Not Connected') {
            await ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('walletStatusInput').value = 'Connected';
        } else {
            // Simulate wallet disconnection
            localStorage.removeItem('walletAddress');
            document.getElementById('walletStatusInput').value = 'Not Connected';
            console.log('Wallet disconnected');
        }
    } catch (error) {
        console.error('Error connecting/disconnecting wallet:', error);
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    const sections = document.querySelectorAll('.section');
    const toggleButtons = document.querySelectorAll('.btn-group .btn');
    const homeLink = document.getElementById('homeLink');
    const connectWalletButton = document.getElementById('connectWalletButton');
    const updateProfileButton = document.getElementById('updateProfileButton');

    function showAllSections() {
        sections.forEach(section => section.style.display = 'block');
        toggleButtons.forEach(button => button.classList.remove('active'));
    }

    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        toggleButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    async function walletIsConnected() {
        const ethereum = window.ethereum;
        if (ethereum) {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            return accounts.length > 0;
        }
        return false;
    }

    async function toggleConnectWalletButton() {
        if (await walletIsConnected()) {
            connectWalletButton.textContent = 'Disconnect Wallet';
        } else {
            connectWalletButton.textContent = 'Connect Wallet';
        }
    }

    async function handleConnectWallet() {
        if (await walletIsConnected()) {
            await disconnectWallet();
        } else {
            await connectWallet();
        }
        await toggleConnectWalletButton();
    }

    async function connectWallet() {
        const ethereum = window.ethereum;
        if (ethereum) {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Wallet connected");
            } catch (error) {
                console.error("User rejected the request.");
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    async function disconnectWallet() {
        // Simulate wallet disconnection
        localStorage.removeItem('walletAddress');
        console.log('Wallet disconnected');
    }

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        showAllSections();
    });

    updateProfileButton.addEventListener('click', function () {
        window.location.href = 'myaccount.html';
    });

    connectWalletButton.addEventListener('click', handleConnectWallet);

    // Set default view to show all sections
    showAllSections();
    // Update the connect wallet button text based on the current wallet connection status
    await toggleConnectWalletButton();
});
