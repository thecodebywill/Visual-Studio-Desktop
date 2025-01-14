// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaynderContract is ReentrancyGuard, Ownable {
    constructor() Ownable(msg.sender) {}

    struct Invoice {
        string invoiceNumber;
        address payable recipient;
        uint256 amount;
        address tokenAddress;
        bool isPaid;
        uint256 dueDate;
        string description;
        PaymentMethod paymentMethod;
        string mpesaPhone; // Optional, for Kotani Pay payments
    }

    enum PaymentMethod {
        WEB3_WALLET,
        MPESA
    }

    mapping(string => Invoice) public invoices;
    mapping(string => string) public mpesaTransactionToInvoice; // Maps Mpesa tx ID to invoice number
    mapping(address => uint256) private userInvoiceCount;

    event InvoiceCreated(
        string invoiceNumber,
        address recipient,
        uint256 amount,
        PaymentMethod method
    );
    event InvoicePaid(
        string invoiceNumber,
        address indexed payer,
        uint256 amount,
        PaymentMethod method
    );
    event MpesaPaymentProcessed(
        string mpesaTransactionId,
        string invoiceNumber,
        string phoneNumber
    );

    function createInvoice(
        string memory _invoiceNumber,
        uint256 _amount,
        address _tokenAddress,
        uint256 _dueDate,
        string memory _description,
        PaymentMethod _method,
        string memory _mpesaPhone
    ) external {
        require(_amount > 0, "Amount must be greater than 0");

        invoices[_invoiceNumber] = Invoice({
            invoiceNumber: _invoiceNumber,
            recipient: payable(msg.sender),
            amount: _amount,
            tokenAddress: _tokenAddress,
            isPaid: false,
            dueDate: _dueDate,
            description: _description,
            paymentMethod: _method,
            mpesaPhone: _mpesaPhone
        });

        userInvoiceCount[msg.sender]++;
        emit InvoiceCreated(_invoiceNumber, msg.sender, _amount, _method);
    }

    function payInvoiceWithWallet(
        string memory _invoiceNumber
    ) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceNumber];
        require(!invoice.isPaid, "Invoice already paid");
        require(
            invoice.paymentMethod == PaymentMethod.WEB3_WALLET,
            "Invalid payment method"
        );
        require(block.timestamp <= invoice.dueDate, "Invoice expired");

        IERC20 token = IERC20(invoice.tokenAddress);
        require(
            token.transferFrom(msg.sender, invoice.recipient, invoice.amount),
            "Payment failed"
        );

        invoice.isPaid = true;
        emit InvoicePaid(
            _invoiceNumber,
            msg.sender,
            invoice.amount,
            PaymentMethod.WEB3_WALLET
        );
    }

    function processMpesaPayment(
        string memory _mpesaTransactionId,
        string memory _invoiceNumber,
        string memory _phoneNumber
    ) external onlyOwner nonReentrant {
        Invoice storage invoice = invoices[_invoiceNumber];
        require(!invoice.isPaid, "Invoice already paid");
        require(
            invoice.paymentMethod == PaymentMethod.MPESA,
            "Invalid payment method"
        );

        invoice.isPaid = true;
        mpesaTransactionToInvoice[_mpesaTransactionId] = _invoiceNumber;

        emit MpesaPaymentProcessed(
            _mpesaTransactionId,
            _invoiceNumber,
            _phoneNumber
        );
        emit InvoicePaid(
            _invoiceNumber,
            address(this),
            invoice.amount,
            PaymentMethod.MPESA
        );
    }

    function getUserInvoicecount() public view returns (uint256) {
        return userInvoiceCount[msg.sender];
    }
}
