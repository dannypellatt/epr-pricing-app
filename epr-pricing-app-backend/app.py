from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Removes unwanted characters
def sanitize_input(data):
    return re.sub(r'[^\w\s]', '', data)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    num_items = int(data['numItems'])
    difficulty = data['difficulty']
    has_base_info = data['hasBaseInfo']

    # Validation (server side)
    if not num_items or not isinstance(num_items, int) or num_items <= 0:
        return jsonify({'error': 'Invalid number of items. Please enter a positive number.'}), 400

    if num_items > 150000:
        return jsonify({'error': 'Number of items exceeds the limit of 150,000.'}), 400

    if difficulty not in ['easy', 'medium', 'hard']:
        return jsonify({'error': 'Invalid difficulty level. Please select from easy, medium, or hard.'}), 400

    if not isinstance(has_base_info, bool):
        return jsonify({'error': 'Invalid value for base information. Must be true or false.'}), 400


    # Difficulty multipliers.
    difficulty_multipliers = {
        'easy': 1,
        'medium': 3,
        'hard': 6
    }

    # These are the ranges on Clay. Last checked: 7/3/24.
    cost_ranges = [
        (2000, 149.00 / 2000),
        (3000, 229.00 / 3000),
        (10000, 349.00 / 10000),
        (14000, 499.00 / 14000),
        (20000, 699.00 / 20000),
        (50000, 800.00 / 50000),
        (70000, 1000.00 / 70000),
        (100000, 1500.00 / 100000),
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

    # Double the cost if base information isn't available
    if not has_base_info:
        total_cost *= 2  

    # Calculate verification cost
    verification_sample_size = math.ceil(num_items * 0.05)
    verification_time_per_item = {
        'easy': 0.5,
        'medium': 1.5,
        'hard': 4
    }
    verification_time = verification_sample_size * verification_time_per_item[difficulty] / 60  # Convert minutes to hours
    verification_cost = verification_time * 30  # $30 per hour

    total_cost += verification_cost

    response = {
        'total_cost': total_cost,
        'verification_time': verification_time,
        'cost_per_item': base_cost_per_scrape,
        'predicted_passes': difficulty_multipliers[difficulty]
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
