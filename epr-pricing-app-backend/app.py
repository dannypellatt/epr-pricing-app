from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    # Implement your cost calculation logic here
    response = {
        'total_cost': 0  # Replace with actual calculation
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
