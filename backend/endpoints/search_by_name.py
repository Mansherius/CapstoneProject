from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology

search_bp = Blueprint("search_by_name", __name__)

def search_recipe_by_name(query):
    """
    Search for a recipe by its name in the ontology.
    """
    query = query.lower()
    results = []

    for individual in ontology.individuals():
        # Check if the individual's name matches the query
        if individual.name.lower() == query:
            recipe_data = {
                "name": individual.name,
                "type": "Recipe",
                "properties": {}
            }
            # Extract all data properties for the individual
            for prop in individual.get_properties():
                values = [str(v) for v in prop[individual]]
                recipe_data["properties"][prop.python_name] = values
            
            results.append(recipe_data)
            break  # Stop searching after finding the first match

    return results


@search_bp.route("/search_by_name", methods=["GET"])
def search_by_name():
    """
    API endpoint to search for a recipe by name.
    """
    query = request.args.get("query", "")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    results = search_recipe_by_name(query)
    if not results:
        return jsonify({"error": f"No recipe found for '{query}'"}), 404

    return jsonify(results)
