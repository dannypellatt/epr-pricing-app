from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    num_items = int(data['numItems'])
    difficulty = data['difficulty']
    has_base_info = data['hasBaseInfo']

    # These are difficulty multipliers.
    difficulty_multipliers = {
        'easy': 1,
        'medium': 3,
        'hard': 6
    }

    # These are the ranges on Clay. Last checked: 7/3/24.
    cost_ranges = [
        (2000, 149.00 / 2000),
        (3000, 149.00 / 3000),
        (10000, 349.00 / 10000),
        (14000, 499.00 / 14000),
        (20000, 699.00 / 20000),
        (50000, 800.00 / 50000),
        (70000, 1000.00 / 70000),
        (10000, 1500.00 / 100000),
        (150000, 2000.00 / 150000)
    ]

    base_cost_per_scrape = None
    for upper_bound, cost in cost_ranges:
        if num_items <= upper_bound:
            base_cost_per_scrape = cost
            break

    if base_cost_per_scrape is None:
        return jsonify({'error': 'Number of items exceeds Clay pricing plans.'}), 400

    multiplier = difficulty_multipliers[difficulty]
    total_cost = num_items * base_cost_per_scrape * multiplier


    response = {'total_cost': total_cost}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)