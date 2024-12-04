from flask import Blueprint, request, jsonify
from helpers.ontology_helper import ontology, format_recipe_data
from fuzzywuzzy import fuzz

details_bp = Blueprint("search_by_details", __name__)

@details_bp.route("/api/search-by-details", methods=["POST"])
def search_by_details():
    try:
        # Normalize the payload
        search_criteria = request.json  # Expecting parameterValuePairs array
        print("Received payload:", search_criteria)

        if not search_criteria:
            return jsonify({"error": "Search criteria is required"}), 400

        # Remove unnecessary fields from the payload
        normalized_criteria = [
            {
                "parameter": criterion["parameter"],
                "value": criterion["value"].strip(),
                "custom": "customInput" in criterion and bool(criterion["customInput"]),
            }
            for criterion in search_criteria
            if "parameter" in criterion and "value" in criterion and criterion["value"].strip()
        ]

        print("Normalized criteria:", normalized_criteria)

        # Start with all recipes
        matched_recipes = list(ontology.individuals())

        # Apply filters progressively
        for criterion in normalized_criteria:
            parameter = criterion["parameter"]
            value = criterion["value"].lower()
            is_custom = criterion["custom"]

            if parameter == "Ingredient":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if all(
                        any(
                            fuzz.partial_ratio(ing.lower(), str(i).lower()) > 80 if is_custom else ing.lower() == str(i).lower()
                            for i in recipe.hasActualIngredients
                        )
                        for ing in [value]
                    )
                ]

            elif parameter == "Cook Time":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasCookTime") and value == str(getattr(recipe, "hasCookTime", [None])[0]).lower()
                ]

            elif parameter == "Cuisine":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasCuisine") and any(
                        fuzz.partial_ratio(value, str(c).lower()) > 80 if is_custom else value == str(c).lower()
                        for c in getattr(recipe, "hasCuisine", [])
                    )
                ]

            elif parameter == "Diet":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasDiet") and any(
                        fuzz.partial_ratio(value, str(d).lower()) > 80 if is_custom else value == str(d).lower()
                        for d in getattr(recipe, "hasDiet", [])
                    )
                ]

            elif parameter == "Difficulty":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasDifficulty") and any(
                        fuzz.partial_ratio(value, str(d).lower()) > 80 if is_custom else value == str(d).lower()
                        for d in getattr(recipe, "hasDifficulty", [])
                    )
                ]

            elif parameter == "Course":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasCourse") and any(
                        fuzz.partial_ratio(value, str(c).lower()) > 80 if is_custom else value == str(c).lower()
                        for c in getattr(recipe, "hasCourse", [])
                    )
                ]

        print(f"Matched recipes after applying filters: {len(matched_recipes)}")

        # Format results using the helper
        results = [format_recipe_data(recipe) for recipe in matched_recipes]

        if not results:
            return jsonify({"error": "No recipes matched the criteria"}), 404

        return jsonify(results), 200

    except Exception as e:
        print(f"Unhandled error: {e}")
        return jsonify({"error": str(e)}), 500
