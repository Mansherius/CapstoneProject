from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology, format_recipe_data

details_bp = Blueprint("search_by_details", __name__)

@details_bp.route("/api/search-by-details", methods=["POST"])
def search_by_details():
    try:
        search_criteria = request.json  # Expecting parameterValuePairs array
        if not search_criteria:
            return jsonify({"error": "Search criteria is required"}), 400

        matched_recipes = list(ontology.individuals())  # Start with all recipes
        
        # Apply filters
        for criterion in search_criteria:
            parameter = criterion.get("parameter")
            values = criterion.get("values", [])
            avoid_values = criterion.get("avoidValues", [])
            value = criterion.get("value", "")

            if parameter == "Ingredient":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if all(ing in [str(i) for i in recipe.hasActualIngredients] for ing in values) and
                    not any(ing in [str(i) for i in recipe.hasActualIngredients] for ing in avoid_values)
                ]
            elif parameter == "Cook Time":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if "hasCookTime" in recipe and value.strip() == str(recipe.hasCookTime[0])
                ]
            elif parameter == "Cuisine":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if "hasCuisine" in recipe and value.strip() in [str(c) for c in recipe.hasCuisine]
                ]
            elif parameter == "Diet":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if "hasDiet" in recipe and value.strip() in [str(d) for d in recipe.hasDiet]
                ]
            elif parameter == "Difficulty":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if "hasDifficulty" in recipe and value.strip() in [str(d) for d in recipe.hasDifficulty]
                ]
            elif parameter == "Course":
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if "hasCourse" in recipe and value.strip() in [str(c) for c in recipe.hasCourse]
                ]

        # Format results using the helper
        results = [format_recipe_data(recipe) for recipe in matched_recipes]

        if not results:
            return jsonify({"error": "No recipes matched the criteria"}), 404

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
