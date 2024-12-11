from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology, format_recipe_data
from fuzzywuzzy import fuzz

search_bp = Blueprint("search_by_name", __name__)

@search_bp.route("/api/search-by-name", methods=["POST"])
def search_by_name():
    try:
        # Extract and validate the input payload
        payload = request.json
        if not payload or "name" not in payload:
            return jsonify({"error": "Name is a required field"}), 400

        # Extract query parameters
        query = payload.get("name", "").lower()
        main_ingredients = [ingredient.strip() for ingredient in payload.get("mainIngredients", []) if ingredient.strip()]
        allergens = [allergen.strip() for allergen in payload.get("allergens", []) if allergen.strip()]

        print(f"Received query: {query}")
        print(f"Main ingredients: {main_ingredients}")
        print(f"Allergens to exclude: {allergens}")

        # Start with all recipes
        matched_recipes = [
            recipe for recipe in ontology.individuals()
            if query in recipe.name.lower()
        ]

        print(f"Recipes matched by name: {len(matched_recipes)}")

        # Filter out recipes containing allergens (Absolute Precedence)
        if allergens:
            matched_recipes = [
                recipe for recipe in matched_recipes
                if not any(
                    fuzz.partial_ratio(allergen.lower(), str(actual_ingredient).lower()) > 80
                    for allergen in allergens
                    for actual_ingredient in getattr(recipe, "hasActualIngredients", [])
                )
            ]
            print(f"Recipes after allergen exclusion: {len(matched_recipes)}")

        # Filter recipes by main ingredients
        if main_ingredients:
            matched_recipes = [
                recipe for recipe in matched_recipes
                if all(
                    any(
                        fuzz.partial_ratio(ingredient.lower(), str(actual_ingredient).lower()) > 80
                        for actual_ingredient in getattr(recipe, "hasActualIngredients", [])
                    )
                    for ingredient in main_ingredients
                )
            ]
            print(f"Recipes after filtering by main ingredients: {len(matched_recipes)}")

        # Format and return the results
        results = [format_recipe_data(recipe) for recipe in matched_recipes]

        if not results:
            return jsonify({"error": f"No recipe found for '{query}' with the given filters"}), 404

        return jsonify(results), 200

    except Exception as e:
        print(f"Unhandled error: {e}")
        return jsonify({"error": str(e)}), 500
