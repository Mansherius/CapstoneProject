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
                "value": criterion["value"].strip() if criterion["value"].strip() else None,
                "values": [v.strip() for v in criterion.get("values", []) if v.strip()],
                "custom": "customInput" in criterion and bool(criterion["customInput"]),
            }
            for criterion in search_criteria
            if "parameter" in criterion and ("value" in criterion or "values" in criterion)
        ]

        print("Normalized criteria:", normalized_criteria)

        # Start with all recipes
        matched_recipes = list(ontology.individuals())

        def resolve_parent_entity(ingredient):
            """
            Resolves the parent entity of an ingredient based on `has_scientific_name`.
            """
            for entity in ontology.individuals():
                labels = []

                try:
                    # Collect preferred labels
                    if hasattr(entity, "has_pref_label"):
                        pref_label = str(entity.has_pref_label).lower()
                        labels.append(pref_label)
                        print(f"Preferred label for {entity}: {pref_label}")

                    # Collect scientific names
                    if hasattr(entity, "has_scientific_name"):
                        scientific_names = [str(name).lower() for name in getattr(entity, "has_scientific_name", [])]
                        labels.extend(scientific_names)
                        print(f"Scientific names for {entity}: {scientific_names}")

                except Exception as e:
                    print(f"Error processing entity {entity}: {e}")
                    continue

                # Check for matches
                try:
                    if any(fuzz.partial_ratio(ingredient.lower(), label) > 80 for label in labels):
                        print(f"Match found for {ingredient} in {entity} with labels: {labels}")
                        return entity
                except Exception as e:
                    print(f"Error matching ingredient '{ingredient}' in {entity}: {e}")
                    continue

            return None  # No match found

        # Apply filters progressively
        for criterion in normalized_criteria:
            parameter = criterion["parameter"]
            value = criterion["value"].lower() if criterion["value"] else None
            values = criterion["values"]
            is_custom = criterion["custom"]

            if parameter == "Ingredient":
                resolved_entities = []
                ingredients_to_check = ([value] if value else []) + values

                for ing in ingredients_to_check:
                    if ing.strip():  # Skip empty strings
                        resolved_entity = resolve_parent_entity(ing.lower())
                        if resolved_entity:
                            resolved_entities.append(resolved_entity)

                # Updated filtering logic for Ingredient
            if resolved_entities:
                resolved_names = [
                    str(entity.name).lower() for entity in resolved_entities
                ]  # Extract simplified names from resolved entities
                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if hasattr(recipe, "hasActualIngredients") and any(
                        ingredient.lower() in resolved_names
                        for ingredient in getattr(recipe, "hasActualIngredients", [])
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
