from flask import Blueprint, jsonify
from helpers.ontology_helper import ontology

data_bp = Blueprint("unique_values", __name__)

@data_bp.route("/api/unique-values", methods=["GET"])
def get_unique_values_with_counts():
    unique_values = {
        "hasCuisine": {},
        "hasDiet": {},
        "hasCourse": {},
    }
    
    for individual in ontology.individuals():
        for prop_name, prop_dict in unique_values.items():
            for value in getattr(individual, prop_name, []):
                value_str = str(value)
                prop_dict[value_str] = prop_dict.get(value_str, 0) + 1

    # Sort values by frequency
    sorted_values = {
        key: sorted(value_dict.items(), key=lambda x: -x[1])
        for key, value_dict in unique_values.items()
    }

    return jsonify(sorted_values)
