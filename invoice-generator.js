let web3;
let account;

// Call this function on page load
window.onload = function() {
    checkWalletConnection();
};

// Check if wallet is already connected
function checkWalletConnection() {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
        account = localStorage.getItem('account');
        updateButtonText();
    }
}

// Function to update button text based on connection status
function updateButtonText() {
    const account = localStorage.getItem('account');
    const connectWalletButton = document.getElementById('connectWalletButton');
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
    account = null;
    updateButtonText();
}

// Connect wallet button functionality
document.addEventListener('DOMContentLoaded', () => {
    updateButtonText();

    document.getElementById('connectWalletButton').addEventListener('click', async function() {
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
                    updateButtonText();
                } catch (error) {
                    console.error('User denied account access or error occurred:', error);
                }
            } else {
                alert('Please install MetaMask or another Web3 wallet provider.');
            }
        }
    });

    // Event listener for the "Generate Invoice" button
    document.getElementById('generateInvoiceButton').addEventListener('click', async function() {
        const walletConnected = localStorage.getItem('walletConnected');
        if (walletConnected !== 'true') {
            alert('Please connect your wallet before generating an invoice.');
            return;
        }

        const invoiceNumber = await fetchInvoiceNumber();
        if (!invoiceNumber) {
            alert('Error generating invoice number. Please try again.');
            return;
        }

        const date = document.getElementById('date').value;
        const dueDate = document.getElementById('dueDate').value;
        const description = document.getElementById('description').value;
        const stablecoin = document.getElementById('stablecoin').value;
        const network = document.getElementById('network').value;
        const amount = document.getElementById('amount').value;

        const invoiceData = {
            invoiceNumber,
            date,
            dueDate,
            description,
            stablecoin,
            network,
            amount,
            walletAddress: localStorage.getItem('account')
        };

        const saveResult = await saveInvoice(invoiceData);
        if (!saveResult || !saveResult.success) {
            alert('Error saving invoice. Please try again.');
            return;
        }

        document.getElementById('invoiceOutput').style.display = 'block';
        document.getElementById('invoiceOutput').innerHTML = `
            <h3>Invoice Created</h3>
            <p>Invoice Number: ${invoiceData.invoiceNumber}</p>
            <p>Date: ${invoiceData.date}</p>
            <p>Due Date: ${invoiceData.dueDate}</p>
            <p>Description: ${invoiceData.description}</p>
            <p>Stablecoin: ${invoiceData.stablecoin}</p>
            <p>Network: ${invoiceData.network}</p>
            <p>Amount Due: ${invoiceData.amount}</p>
            <button class="btn btn-success" id="downloadPDFButton">Download PDF</button>
            <button class="btn btn-primary" id="shareWhatsAppButton">Share via WhatsApp</button>
            <button class="btn btn-info" id="shareEmailButton">Share via Email</button>
        `;

        document.getElementById('downloadPDFButton').addEventListener('click', downloadPDF);
        document.getElementById('shareWhatsAppButton').addEventListener('click', shareWhatsApp);
        document.getElementById('shareEmailButton').addEventListener('click', shareEmail);

        // Set the invoice number in the hidden input for downloadPDF function
        document.getElementById('invoiceNumber').value = invoiceData.invoiceNumber;
    });
});

// Function to request the next invoice number from the backend
async function fetchInvoiceNumber() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get-next-invoice-number');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.invoiceNumber; // Ensure this matches your backend response
    } catch (error) {
        console.error('Error fetching invoice number:', error);
        return null;
    }
}

// Function to save the invoice to the backend
async function saveInvoice(invoiceData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/save-invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        return { success: true };
    } catch (error) {
        console.error('Error saving invoice:', error);
        return { success: false };
    }
}

// Function to create PDF
function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            console.error('jsPDF is not loaded');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('Invoice', 10, 10);

        const invoiceData = getInvoiceData();
        doc.setFontSize(16);
        doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 10, 20);
        doc.text(`Date: ${invoiceData.date}`, 10, 30);
        doc.text(`Due Date: ${invoiceData.dueDate}`, 10, 40);
        doc.text(`Description: ${invoiceData.description}`, 10, 50);
        doc.text(`Stablecoin: ${invoiceData.stablecoin}`, 10, 60);
        doc.text(`Network: ${invoiceData.network}`, 10, 70);
        doc.text(`Amount Due: ${invoiceData.amount}`, 10, 80);
        doc.text(`Wallet Address for Payment: ${invoiceData.walletAddress}`, 10, 90);

        // Add a footer
        doc.setFontSize(12);
        doc.text('Paynder Ltd.', 10, 120);
        doc.text('Email: info@paynder.com', 10, 130);
        doc.text('Website: www.paynder.com', 10, 135);

        // Save the PDF
        doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

// Function to share via WhatsApp
function shareWhatsApp() {
    const invoiceData = getInvoiceData();
    const walletAddress = localStorage.getItem('account') || 'Not connected';
    const message = `Invoice Details:\n\nInvoice Number: ${invoiceData.invoiceNumber}\nDate: ${invoiceData.date}\nDue Date: ${invoiceData.dueDate}\nDescription: ${invoiceData.description}\nStablecoin: ${invoiceData.stablecoin}\nNetwork: ${invoiceData.network}\nAmount Due: ${invoiceData.amount}\nWallet Address for Payment: ${walletAddress}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Function to share via Email
function shareEmail() {
    const invoiceData = getInvoiceData();
    const walletAddress = localStorage.getItem('account') || 'Not connected';
    const subject = 'Invoice Details';
    const body = `Invoice Details:\n\nInvoice Number: ${invoiceData.invoiceNumber}\nDate: ${invoiceData.date}\nDue Date: ${invoiceData.dueDate}\nDescription: ${invoiceData.description}\nStablecoin: ${invoiceData.stablecoin}\nNetwork: ${invoiceData.network}\nAmount Due: ${invoiceData.amount}\nWallet Address for Payment: ${walletAddress}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
}

function getInvoiceData() {
    return {
        invoiceNumber: document.getElementById('invoiceNumber').value,
        date: document.getElementById('date').value,
        dueDate: document.getElementById('dueDate').value,
        description: document.getElementById('description').value,
        stablecoin: document.getElementById('stablecoin').value,
        network: document.getElementById('network').value,
        amount: document.getElementById('amount').value,
        walletAddress: localStorage.getItem('account')
    };
}
//Mobile friendly
document.getElementById('connectWalletButton').addEventListener('click', function () {
    var dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.classList.toggle('show');
});

// Close the dropdown if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('#connectWalletButton')) {
        var dropdowns = document.getElementsByClassName("dropdown-menu");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};