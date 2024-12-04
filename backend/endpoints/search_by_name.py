from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology, format_recipe_data

search_bp = Blueprint("search_by_name", __name__)

@search_bp.route("/api/search-by-name", methods=["GET"])
def search_by_name():
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = []
    for individual in ontology.individuals():
        if query in individual.name.lower():
            results.append(format_recipe_data(individual))

    if not results:
        return jsonify({"error": f"No recipe found for '{query}'"}), 404

    # print("Backend Output:", results)  # Add this for debugging
    return jsonify(results), 200