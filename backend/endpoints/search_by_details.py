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
                "value": (criterion.get("value") or "").strip(),  # Ensure value is always a string
                "values": criterion.get("values", []),
                "avoidValues": criterion.get("avoidValues", []),  # Capture avoid values
                "custom": "customInput" in criterion and bool(criterion["customInput"]),
            }
            for criterion in search_criteria
            if "parameter" in criterion and ("value" in criterion or "values" in criterion or "avoidValues" in criterion)
        ]

        print("Normalized criteria:", normalized_criteria)

        # Start with all recipes
        matched_recipes = list(ontology.individuals())

        # Allergen Exclusion Logic (Absolute Precedence)
        for criterion in normalized_criteria:
            if "avoidValues" in criterion and criterion["avoidValues"]:
                avoid_values = criterion["avoidValues"]
                print(f"Excluding recipes with allergens: {avoid_values}")

                matched_recipes = [
                    recipe for recipe in matched_recipes
                    if not any(
                        fuzz.partial_ratio(avoid.lower(), str(actual_ingredient).lower()) > 80
                        for avoid in avoid_values
                        for actual_ingredient in getattr(recipe, "hasActualIngredients", [])
                    )
                ]

        print(f"Recipes after allergen exclusion: {len(matched_recipes)}")

        def resolve_parent_entity(ingredient):
            """
            Resolves the parent entity of an ingredient based on:
            1. Exact match on preferred label, scientific name, or alt label.
            2. Match on individual words in labels.
            3. Fuzzy match as a fallback for partial matches.
            """
            exact_matches = set()
            word_matches = set()
            fuzzy_matches = set()
            ingredient_lower = ingredient.lower()

            for entity in ontology.individuals():
                try:
                    labels = {}

                    # Collect preferred label
                    if hasattr(entity, "has_pref_label"):
                        pref_label = str(entity.has_pref_label).lower()
                        labels["pref_label"] = pref_label

                    # Collect scientific names
                    if hasattr(entity, "has_scientific_name"):
                        scientific_names = [str(name).lower() for name in getattr(entity, "has_scientific_name", [])]
                        labels["scientific_names"] = scientific_names

                    # Collect alt labels
                    if hasattr(entity, "has_alt_labels"):
                        alt_labels = [str(label).lower() for label in getattr(entity, "has_alt_labels", [])]
                        labels["alt_labels"] = alt_labels

                    # Flatten all labels for comparison
                    all_labels = [labels["pref_label"]] + labels.get("scientific_names", []) + labels.get("alt_labels", [])

                    # 1. Exact match for the full input
                    if ingredient_lower in all_labels:
                        print(f"Exact match for '{ingredient}' in {entity} with labels: {all_labels}")
                        exact_matches.add(entity)
                        continue  # Skip to the next entity if we find an exact match

                    # 2. Match for individual words
                    ingredient_words = set(ingredient_lower.split())
                    for label in all_labels:
                        label_words = set(label.split())
                        if ingredient_words & label_words:  # Common words exist
                            print(f"Word match for '{ingredient}' in {entity} with label: '{label}'")
                            word_matches.add(entity)
                            break

                    # 3. Fuzzy match for partial matches
                    if any(fuzz.partial_ratio(ingredient_lower, label) > 80 for label in all_labels):
                        print(f"Fuzzy match for '{ingredient}' in {entity} with labels: {all_labels}")
                        fuzzy_matches.add(entity)

                except Exception as e:
                    print(f"Error processing entity {entity}: {e}")
                    continue

            # Combine results, prioritizing exact and word matches over fuzzy matches
            combined_results = list(exact_matches) or list(word_matches) or list(fuzzy_matches)

            if combined_results:
                print(f"Returning closest match for '{ingredient}' from {combined_results}")
                return combined_results[0]

            return None  # No match found

        # Apply filters progressively
        for criterion in normalized_criteria:
            parameter = criterion["parameter"]
            value = criterion["value"].lower() if criterion["value"] else None
            values = criterion["values"]
            is_custom = criterion["custom"]

            if parameter == "Ingredient":
                resolved_entities = []
                for ing in (criterion.get("values", []) if not value else [value]):
                    if ing:  # Skip empty strings
                        resolved_entity = resolve_parent_entity(ing.lower())
                        if resolved_entity:
                            resolved_entities.append(resolved_entity)

                if resolved_entities:
                    matched_recipes = [
                        recipe for recipe in matched_recipes
                        if any(
                            fuzz.partial_ratio(resolved_entity.name.lower(), str(actual_ingredient).lower()) > 80
                            for resolved_entity in resolved_entities
                            for actual_ingredient in getattr(recipe, "hasActualIngredients", [])
                        )
                    ]

            elif parameter == "Cook Time":
                matched_recipes = [
                    recipe
                    for recipe in matched_recipes
                    if hasattr(recipe, "hasCookTime") and
                    any(value.strip().lower() == str(cook_time).strip().lower() for cook_time in getattr(recipe, "hasCookTime", []))
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
