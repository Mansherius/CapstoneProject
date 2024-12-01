from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology

autocomplete_bp = Blueprint("autocomplete", __name__)

def get_autocomplete_suggestions(query):
    """
    Fetch autocomplete suggestions for a given query.
    """
    query = query.lower()
    suggestions = []

    for individual in ontology.individuals():
        if individual.name.lower().startswith(query):
            suggestion_type = "Recipe" if "FoodRecipes" in [cls.name for cls in individual.is_a] else "Other"
            suggestions.append({
                "name": individual.name,
                "type": suggestion_type,
                "is_bold": True if query in individual.name.lower() else False,
            })

    return suggestions


@autocomplete_bp.route("/api/autocomplete", methods=["GET"])
def autocomplete():
    """
    API endpoint for autocomplete suggestions.
    """
    query = request.args.get("query", "")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    suggestions = get_autocomplete_suggestions(query)
    return jsonify(suggestions)
