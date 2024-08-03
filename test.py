from flask import Flask, request, jsonify

app = Flask(__name__)

# Example user data (replace with your own authentication mechanism)
users = {
    "testuser10": "Puregreen24@"  # username: password
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in users and users[username] == password:
        # Generate a token (dummy token here; replace with your own logic)
        token = 'dummy_token'
        return jsonify({'message': 'Login successful', 'token': token})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
