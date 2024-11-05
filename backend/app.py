from flask import Flask, jsonify, request
from flask_cors import CORS
from owlready2 import get_ontology
import pandas as pd
import re

# Load the OWL ontology file
ontology_path = "../data/indian_food_ontology_v1.owl"
ontology = get_ontology(ontology_path).load()

# Set up Flask app
app = Flask(__name__)
CORS(app)

# API to get all classes in the ontology
@app.route('/api/classes', methods=['GET'])
def get_classes():
    try:
        classes = [cls.name for cls in ontology.classes()]  # Fetch all classes
        return jsonify(classes)  # Return the classes in JSON format
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to get individuals of a specific class
@app.route('/api/class/<name>/individuals', methods=['GET'])
def get_class_individuals(name):
    try:
        # Find the class by name in the ontology
        cls = ontology.search_one(iri="*" + name)
        if cls:
            individuals = [ind.name for ind in cls.instances()]  # Fetch individuals of the class
            return jsonify(individuals)
        else:
            return jsonify({"error": "Class not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to get properties of a specific class
@app.route('/api/class/<name>/properties', methods=['GET'])
def get_class_properties(name):
    try:
        # Find the class by name in the ontology
        cls = ontology.search_one(iri="*" + name)
        if cls:
            properties = [prop.name for prop in cls.get_properties()]  # Fetch properties of the class
            return jsonify(properties)
        else:
            return jsonify({"error": "Class not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start the Flask app on a specified port (e.g., port 5001)
if __name__ == '__main__':
    app.run(debug=True, port=5001)
