from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology  # Assuming ontology is properly loaded in this helper

search_bp = Blueprint("search_by_name", __name__)

@search_bp.route("/api/search-by-name", methods=["GET"])
def search_by_name():
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = []
    for individual in ontology.individuals():
        if query in individual.name.lower():
            recipe_data = {
                "name": individual.name,
                "type": "Recipe",
                "properties": {
                    prop.python_name: [str(v) for v in prop[individual]]
                    for prop in individual.get_properties()
                },
            }
            results.append(recipe_data)

    if not results:
        return jsonify({"error": f"No recipe found for '{query}'"}), 404

    # print("Backend Output:", results)  # Add this for debugging
    return jsonify(results), 200