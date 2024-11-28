import os
import bcrypt
import jwt
import flask_pymongo
from flask_pymongo import PyMongo
import logging
import uuid
import datetime
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from web3 import Web3
from bson.json_util import dumps
from bson.objectid import ObjectId
from  flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import timedelta
from functools import wraps




# Load environment variables from .env file
load_dotenv()
# Retrieve the secret key from environment variables
secret_key = os.getenv('FLASK_SECRET_KEY')

# Configure Flask app
app = Flask(__name__)

CORS(app)


#retrive 
jwt_expire_str = os.getenv('JWT_ACCESS_TOKEN_EXPIRES')
if jwt_expire_str is None:
    raise ValueError("JWT_ACCESS_TOKEN_EXPIRES is not set in the environment")

jwt_expire_str = jwt_expire_str.strip()
print(f"JWT_ACCESS_TOKEN_EXPIRES value read from .env: '{jwt_expire_str}'")  # Debugging line

try:
    jwt_access_token_expires = int(jwt_expire_str)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=jwt_access_token_expires)
except ValueError:
    raise ValueError(f"Invalid value for JWT_ACCESS_TOKEN_EXPIRES: {jwt_expire_str}")

#JWT CONFIG
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-default-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 1)))

# Initialize JWTManager
jwt = JWTManager(app)

#define secret_key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

#secret key
app.secret_key = secret_key  # Set the Flask secret key
CORS(app)
#configure mongo 
app.config["MONGO_URI"] = "mongodb://localhost:27017/Paynder"
mongo = PyMongo(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Web3 for Celo
infura_url = "https://celo-mainnet.infura.io/v3/384955d369e64779965960a87c16fc3d"
web3 = Web3(Web3.HTTPProvider(infura_url))

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/Paynder")
db = client['Paynder']
invoices_collection = db['invoices']
payment_links_collection = db['payment_links']
on_ramp_off_ramp_collection = db['on_ramp_off_ramp']
users_collection = db['users']
settings_collection = db['settings']


@app.route('/create_invoice', methods=['POST'])
def create_invoice():
    data = request.json
    invoice_id = str(uuid.uuid4())
    amount = data.get('amount')
    description = data.get('description', '')
    expiration = datetime.datetime.now() + datetime.timedelta(minutes=15)
    stablecoin = data.get('stablecoin')
    network = data.get('network')

    # Generate a wallet address for the recipient
    private_key = web3.eth.account.create().privateKey.hex()
    wallet_address = web3.eth.account.privateKeyToAccount(private_key).address

    # Store invoice details in MongoDB
    invoice = {
        'invoice_id': invoice_id,
        'amount': amount,
        'description': description,
        'status': 'pending',
        'expiration': expiration,
        'wallet_address': wallet_address,
        'stablecoin': stablecoin,
        'network': network
    }
    invoices_collection.insert_one(invoice)

    return jsonify({
        'invoice_id': invoice_id,
        'amount': amount,
        'description': description,
        'expiration': expiration.isoformat(),
        'qr_code': f"https://api.qrserver.com/v1/create-qr-code/?data={invoice_id}",
        'wallet_address': wallet_address
    })

@app.route('/api/get-next-invoice-number', methods=['GET'])
def get_next_invoice_number():
    try:
        current_year = datetime.datetime.now().year
        settings = settings_collection.find_one({'year': current_year})

        if not settings:
            # Initialize with the first invoice number for the current year
            invoice_number = f"{current_year}/001"
            settings_collection.insert_one({'year': current_year, 'last_invoice_number': invoice_number})
        else:
            # Extract last invoice number and calculate the next one
            last_invoice_number = settings.get('last_invoice_number', None)
            if last_invoice_number:
                year, number = last_invoice_number.split('/')
                next_number = str(int(number) + 1).zfill(3)
                invoice_number = f"{year}/{next_number}"
            else:
                # Handle the case where `last_invoice_number` is not in the expected format
                invoice_number = f"{current_year}/001"

            # Update the settings collection with the new invoice number
            settings_collection.update_one(
                {'year': current_year},
                {'$set': {'last_invoice_number': invoice_number}}
            )

        return jsonify({'invoiceNumber': invoice_number})
    except Exception as e:
        logging.error(f'Error generating invoice number: {str(e)}')
        return jsonify({'error': 'Error generating invoice number'}), 500

@app.route('/api/save-invoice', methods=['POST'])
def save_invoice():
    try:
        data = request.json
        invoice_id = data.get('invoice_id')
        amount = data.get('amount')
        description = data.get('description')
        status = data.get('status')
        expiration = data.get('expiration')
        bitcoin_address = data.get('bitcoin_address')
        paid_at = data.get('paid_at')
        network = data.get('network')
        payment_link = data.get('payment_link')
        stablecoin = data.get('stablecoin')
        transaction_id = data.get('transaction_id')
        wallet_address = data.get('wallet_address')
        invoice_number = data.get('invoiceNumber')

        # Insert invoice into MongoDB
        invoices_collection.insert_one({
            'invoice_id': invoice_id,
            'amount': amount,
            'description': description,
            'status': status,
            'expiration': expiration,
            'bitcoin_address': bitcoin_address,
            'paid_at': paid_at,
            'network': network,
            'payment_link': payment_link,
            'stablecoin': stablecoin,
            'transaction_id': transaction_id,
            'wallet_address': wallet_address,
            'invoiceNumber': invoice_number
        })

        return jsonify({'message': 'Invoice saved successfully'}), 201
    except Exception as e:
        logging.error(f'Error saving invoice: {str(e)}')
        return jsonify({'error': 'Error saving invoice'}), 500

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
        else:
            return jsonify({'error': 'Unsupported network'}), 400

        invoices_collection.update_one({'invoice_id': invoice_id}, {'$set': {'status': 'paid'}})
        return jsonify({'status': 'Payment successful', 'invoice_id': invoice_id})
    except Exception as e:
        logger.error(f'Payment failed: {str(e)}')
        return jsonify({'error': f'Payment failed: {str(e)}'}), 500

def send_celo_payment(wallet_address, amount):
    # Add logic to send payment via Celo
    contract_address = "stablecoin_contract_address"  # Replace with actual contract address
    contract_abi = [...]  # Replace with the actual ABI
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

    sender_address = "0x4f6bBf67e1A2314799f51C301170FAFFCCd466C2"
    private_key = os.getenv('PRIVATE_KEY') # Added to environment viriable

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

@app.route('/pay', methods=['GET'])
def handle_payment():
    description = request.args.get('desc')
    stablecoin = request.args.get('coin')
    network = request.args.get('network')
    amount = request.args.get('amount')

    if not all([description, stablecoin, network, amount]):
        return jsonify({"error": "Missing parameters"}), 400

    return jsonify({"status": "Payment initiated", "description": description, "stablecoin": stablecoin, "network": network, "amount": amount})

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

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        phone = data.get('phone')
        wallet_address = data.get('walletAddress')

        if not all([username, password, email, phone, wallet_address]):
            return jsonify({"error": "Missing fields"}), 400

        # Check if the user already exists
        user = users_collection.find_one({"username": username})
        if user:
            return jsonify({"error": "User already exists"}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create new user
        new_user = {
            "username": username,
            "password": hashed_password,
            "email": email,
            "phone": phone,
            "walletAddress": wallet_address
        }
        users_collection.insert_one(new_user)
        token = create_access_token(identity=str(new_user['_id']))
        return jsonify({"message": "User created successfully", "token": token}), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({"error": "An error occurred during signup"}), 500
if __name__ == '__main__':
    app.run(debug=True)

users_collection = mongo.db.users


if __name__ == '__main__':
    app.run(debug=True)



@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    try:
        user = users_collection.find_one({"username": username})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            token = create_access_token(identity=username)
            return jsonify({'token': token, 'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        logger.error(f'Error occurred during login: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500
#Route Protected 
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/connect_wallet', methods=['POST'])
@jwt_required()
def connect_wallet():
    data = request.json
    email = data.get('email')
    wallet_address = data.get('wallet_address')
    
    if not email or not wallet_address:
        return jsonify({'error': 'Email and wallet address are required'}), 400

    # Update user document with the provided wallet address
    result = users_collection.update_one(
        {'email': email},
        {'$set': {'wallet_address': wallet_address}}
    )

    if result.modified_count > 0:
        return jsonify({'message': 'Wallet connected successfully'}), 200
    else:
        return jsonify({'error': 'User not found or wallet already connected'}), 400

if __name__ == '__main__':
    app.run(debug=True)
#wallet balance
@app.route('/api/account-balance', methods=['GET'])
def get_account_balance():
    balances = {
        'cusd': '1000.00',
        'usdt': '500.00',
        'usdc': '750.00'
    }
    return jsonify(balances)
#Hash password
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')
#GetUser details 

    #getuser details for my account
    # Get user details
@app.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        current_user = get_jwt_identity()
        user = users_collection.find_one({"username": current_user})
        if user:
            user_data = {
                "username": user['username'],
                "email": user['email'],
                "phone": user['phone'],
                "walletAddress": user['walletAddress']
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error fetching user details: {str(e)}")
        return jsonify({"error": "An error occurred while fetching user details"}), 500

# Update user details
app.route('/user', methods=['PUT'])
@jwt_required()
def update_user():
    try:
        current_user = get_jwt_identity()
        data = request.json
        updated_fields = {}

        if 'email' in data:
            updated_fields['email'] = data['email']
        if 'phone' in data:
            updated_fields['phone'] = data['phone']
        if 'walletAddress' in data:
            updated_fields['walletAddress'] = data['walletAddress']

        result = users_collection.update_one({"username": current_user}, {"$set": updated_fields})
        if result.modified_count > 0:
            return jsonify({"message": "Profile updated successfully"}), 200
        else:
            return jsonify({"error": "No changes made"}), 400
    except Exception as e:
        logging.error(f"Error updating user details: {str(e)}")
        return jsonify({"error": "An error occurred while updating user details"}), 500
    #verify user
@app.route('/verify_token', methods=['GET'])
@jwt_required(optional=True)
def verify_token():
    try:
        # This will validate the token and refresh it if necessary
        current_user = get_jwt_identity()
        if current_user:
            return jsonify({"message": "Token is valid"}), 200
        else:
            return jsonify({"message": "Token is invalid or expired"}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 401

#update user details
@app.route('/update_profile', methods=['POST'])
def update_profile():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    
    # Logic to update profile in the database goes here

    return jsonify({'message': 'Profile updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)

#get user details
@app.route('/user_details', methods=['GET'])
@jwt_required()
def get_user_details():
    try:
        current_user = get_jwt_identity()
        user = users_collection.find_one({"username": current_user})
        if user:
            user_data = {
                "username": user['username'],
                "email": user['email'],
                "phone": user.get('phone', ''),
                "walletAddress": user.get('walletAddress', ''),
                "idNumber": user.get('idNumber', '')
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f"Error fetching user details: {str(e)}")
        return jsonify({"error": "An error occurred while fetching user details"}), 500
#update user details
@app.route('/update_user_details', methods=['POST'])
@jwt_required()
def update_user_details():
    try:
        current_user = get_jwt_identity()
        data = request.json
        users_collection.update_one(
            {"username": current_user},
            {"$set": {
                "phone": data.get('phone', ''),
                "walletAddress": data.get('walletAddress', ''),
                "idNumber": data.get('idNumber', '')
            }}
        )
        return jsonify({"msg": "User details updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error updating user details: {str(e)}")
        return jsonify({"error": "An error occurred while updating user details"}), 500
    
import requests


@app.route('/api/price/<stablecoin>', methods=['GET'])
def get_price(stablecoin):
    api_key = 'b198798d-aa0e-4f44-8be0-eecd59f1db98'
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
    headers = {
        'X-CMC_PRO_API_KEY': api_key
    }
    params = {
        'symbol': stablecoin.upper(),
        'convert': 'KES'
    }

    logging.debug(f'Requesting price for: {stablecoin.upper()}')
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors

        data = response.json()
        logging.debug(f'Response data: {data}')  # Log the response data
        base_price = data['data'][stablecoin.upper()]['quote']['KES']['price']
        commission_rate = 0.01  # 1% commission
        buy_price = base_price * (1 + commission_rate)  # Buy price with commission
        sell_price = base_price * (1 - commission_rate)  # Sell price with commission
        
        return jsonify({
            'base_price': base_price,
            'buy_price': buy_price,
            'sell_price': sell_price
        })
    except requests.RequestException as e:
        logging.error(f"Request error: {e}")
        return jsonify({'error': 'Failed to fetch data from CoinMarketCap'}), 500
    except KeyError:
        return jsonify({'error': 'Invalid token symbol or data not available'}), 404

if __name__ == '__main__':
    app.run(debug=True)
