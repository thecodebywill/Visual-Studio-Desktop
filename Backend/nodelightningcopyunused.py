# Existing imports
import grpc
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import uuid
import datetime
import Backend.lightning_pb2_grpc as lightning_pb2_grpc
import Backend.lightning_pb2 as lightning_pb2
from web3 import Web3
from bitcoin import random_key, privtopub, pubtoaddr

# Configure Flask app
app = Flask(__name__)
CORS(app)

# Web3 for Celo
infura_url = "https://celo-mainnet.infura.io/v3/384955d369e64779965960a87c16fc3d"
web3 = Web3(Web3.HTTPProvider(infura_url))

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/Paynder")
db = client['Paynder']
invoices_collection = db['invoices']
payment_links_collection = db['payment_links']  # New collection for payment links
on_ramp_off_ramp_collection = db['on_ramp_off_ramp']  # New collection for on-ramp and off-ramp activities

# Lightning Network configuration- Not useful until later
lnd_config = {
    "host": "payndermain.m.voltageapp.io",
    "port": 10009,
    "macaroon_path": "c:\\Users\\HP\\Documents\\Visual Studio Desktop\\admin.macaroon"
}

def connect_to_lnd():
    with open(lnd_config["macaroon_path"], 'rb') as f:
        macaroon_bytes = f.read()
    
    metadata = [('macaroon', macaroon_bytes.hex())]
    macaroon_creds = grpc.metadata_call_credentials(lambda context, callback: callback(metadata, None))
    ssl_creds = grpc.ssl_channel_credentials()
    combined_creds = grpc.composite_channel_credentials(ssl_creds, macaroon_creds)
    channel = grpc.secure_channel(f"{lnd_config['host']}:{lnd_config['port']}", combined_creds)
    return lightning_pb2_grpc.LightningStub(channel)

@app.route('/create_invoice', methods=['POST'])
def create_invoice():
    data = request.json
    invoice_id = str(uuid.uuid4())
    amount = data.get('amount')
    description = data.get('description', '')
    expiration = datetime.datetime.now() + datetime.timedelta(minutes=15)

    # Generate a wallet address for the recipient
    private_key = random_key()
    public_key = privtopub(private_key)
    bitcoin_address = pubtoaddr(public_key)

    # Store invoice details in MongoDB
    invoice = {
        'invoice_id': invoice_id,
        'amount': amount,
        'description': description,
        'status': 'pending',
        'expiration': expiration,
        'wallet_address': bitcoin_address
    }
    invoices_collection.insert_one(invoice)

    return jsonify({
        'invoice_id': invoice_id,
        'amount': amount,
        'description': description,
        'expiration': expiration.isoformat(),
        'qr_code': f"https://api.qrserver.com/v1/create-qr-code/?data={invoice_id}",
        'wallet_address': bitcoin_address
    })

@app.route('/pay_invoice', methods=['POST'])
def pay_invoice_route():
    data = request.json
    invoice_id = data.get('invoice_id')
    network = data.get('network')
    wallet_address = data.get('wallet_address')
    amount = data.get('amount')

    invoice = invoices_collection.find_one({'invoice_id': invoice_id})
    if not invoice:
        return jsonify({'error': 'Invalid invoice ID'}), 404

    if invoice['status'] != 'pending':
        return jsonify({'error': 'Invoice already paid or canceled'}), 400

    if datetime.datetime.now() > invoice['expiration']:
        return jsonify({'error': 'Invoice has expired'}), 400

    try:
        if network == 'Celo':
            # Sending payment via Celo Network
            send_celo_payment(wallet_address, amount)
        elif network == 'Lightning':
            # Sending payment via Lightning Network
            send_lightning_payment(invoice_id, amount)
        else:
            return jsonify({'error': 'Unsupported network'}), 400

        invoices_collection.update_one({'invoice_id': invoice_id}, {'$set': {'status': 'paid'}})
        return jsonify({'status': 'Payment successful', 'invoice_id': invoice_id})
    except Exception as e:
        return jsonify({'error': f'Payment failed: {str(e)}'}), 500

def send_celo_payment(wallet_address, amount):
    # Add logic to send payment via Celo
    contract_address = "stablecoin_contract_address"  # Replace with actual contract address
    contract_abi = [...]  # Replace with the actual ABI
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

    sender_address = "0x4f6bBf67e1A2314799f51C301170FAFFCCd466C2"
    private_key = "61efed6aaeff37fe66ee54a61bf5c2ce43a599a4fc4e309daeb9d12a679a6742"  # Replace with actual private key

    nonce = web3.eth.getTransactionCount(sender_address)
    tx = contract.functions.transfer(wallet_address, web3.toWei(amount, 'ether')).buildTransaction({
        'chainId': 42220,  # Celo Mainnet chain ID
        'gas': 2000000,
        'gasPrice': web3.toWei('5', 'gwei'),
        'nonce': nonce
    })

    signed_tx = web3.eth.account.signTransaction(tx, private_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return web3.toHex(tx_hash)

def send_lightning_payment(invoice_id, amount):
    lnd_stub = connect_to_lnd()
    payment_request = lightning_pb2.SendRequest(
        payment_request=invoice_id,
        value=amount
    )
    response = lnd_stub.SendPayment(payment_request)
    if response.payment_error:
        raise Exception(response.payment_error)
    return response

@app.route('/pay', methods=['GET'])
def handle_payment():
    description = request.args.get('desc')
    stablecoin = request.args.get('coin')
    network = request.args.get('network')
    amount = request.args.get('amount')

    if not all([description, stablecoin, network, amount]):
        return jsonify({"error": "Missing parameters"}), 400

    return jsonify({"status": "Payment initiated", "description": description, "stablecoin": stablecoin, "network": network, "amount": amount})

# Dashboard routes
@app.route('/get_invoices', methods=['GET'])
def get_invoices():
    invoices = list(invoices_collection.find({}, {'_id': 0}))
    return jsonify(invoices)

@app.route('/get_payment_links', methods=['GET'])
def get_payment_links():
    payment_links = list(payment_links_collection.find({}, {'_id': 0}))
    return jsonify(payment_links)

@app.route('/get_wallet_balance', methods=['GET'])
def get_wallet_balance():
    # Example balance fetching logic; adjust as needed
    balance = {
        'amount': '100.00',
        'currency': 'CUSD'
    }
    return jsonify(balance)

@app.route('/get_on_ramp_off_ramp_activities', methods=['GET'])
def get_on_ramp_off_ramp_activities():
    activities = list(on_ramp_off_ramp_collection.find({}, {'_id': 0}))
    return jsonify(activities)

# On-ramp and off-ramp routes
@app.route('/on_ramp', methods=['POST'])
def on_ramp():
    data = request.get_json()
    stablecoin = data['stablecoin']
    amount = data['amount']
    mpesa_number = data['mpesaNumber']
    user_address = data['userAddress']

    # Handle on-ramping logic here

    return jsonify({'status': 'On-ramp successful'})

@app.route('/off_ramp', methods=['POST'])
def off_ramp():
    data = request.get_json()
    stablecoin = data['stablecoin']
    amount = data['amount']
    mpesa_number = data['mpesaNumber']
    user_address = data['userAddress']

    # Handle off-ramping logic here

    return jsonify({'status': 'Off-ramp successful'})

if __name__ == '__main__':
    app.run(debug=True)
#Signup API
from flask import Flask, request, jsonify

app = Flask(__name__)

# Replace with your MongoDB URI
client = MongoClient('mongodb://localhost:27017/')
db = client['paynder']
users_collection = db['users']

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input data
    required_fields = ['username', 'password', 'email', 'phone', 'walletAddress']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400

    username = data['username']
    password = data['password']
    email = data['email']
    phone = data['phone']
    wallet_address = data['walletAddress']

    # Check if user already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password, method='sha256')

    # Insert new user
    users_collection.insert_one({
        'username': username,
        'password': hashed_password,
        'email': email,
        'phone': phone,
        'wallet_address': wallet_address  # Store the wallet address here
    })

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/connect_wallet', methods=['POST'])
def connect_wallet():
    data = request.json

    # Validate input data
    if 'username' not in data or 'wallet_address' not in data:
        return jsonify({'error': 'Missing fields'}), 400

    username = data['username']
    wallet_address = data['wallet_address']

    # Update user record with wallet address
    result = users_collection.update_one(
        {'username': username},
        {'$set': {'wallet_address': wallet_address}}
    )

    if result.modified_count > 0:
        return jsonify({'message': 'Wallet connected successfully'}), 200
    else:
        return jsonify({'error': 'User not found or wallet already connected'}), 400

if __name__ == '__main__':
    app.run(debug=True)

