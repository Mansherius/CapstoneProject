from flask import Flask, request, jsonify, render_template_string
from owlready2 import get_ontology, default_world
from fuzzywuzzy import process
import pandas as pd
import re
from autocomplete_feature import *

ontology = get_ontology('../data/cleaned.owl').load()

languages = [
    'Assamese', 'Bengali', 'English', 'Gujarati', 'Hindi',
    'Kannada', 'Kashmiri', 'Khasi', 'Konkani', 'Malayalam',
    'Manipuri', 'Marathi', 'Nepali', 'Oriya', 'Punjabi',
    'Sanskrit', 'Tamil', 'Telugu', 'Urdu', 'Common_Name']

language_tag = {
    "Assamese": "as", "Bengali": "bn", "English": "en", "Gujarati": "gu", "Hindi": "hi",
                "Kannada": "kn", "Kashmiri": "ks", "Khasi": "kha", "Konkani": "kok", "Malayalam": "ml",
                "Manipuri": "mni", "Marathi": "mr", "Nepali": "ne", "Oriya": "or", "Punjabi": "pa",
                "Sanskrit": "sa", "Tamil": "ta", "Telugu": "te", "Urdu": "ur", "Common_Name": "cmn"}

reversed_language_tag = {v: k for k, v in language_tag.items()}


def get_full_language_name(lang_tag):
    return reversed_language_tag.get(lang_tag, "Unknown")

# Multi-field Recipe Search:

# 'search_criteria' is a dictionary which maps each recipe attribute to a user-inputted value
# The flask app below will fetch all relevant search attributes from the query string
# Function returns a filtered dataframe with each column being a recipe attribute, beginning with recipe name and ID

# Further changes:
# Searching for ingredients and recipes in POST (as opposed to the current GET format in the Flask app below)
# Checking for typos in the search (using typo_suggester) and returns results based on corrected search query
# Searching for multiple words accurately: e.g. if searching tomato salad, getting results like "tomato cheese salad"
# Searching for exact matchies in specific fields and non-exact matches (again finding a workaround for str.contains())
# Cleaning the numerical values (E.g. cooktime and acidity) and creating funcitonality for a range-search.
# Currently can only search for the presence of one ingredient in the recipe instead of multiple ingredients at once
# Should be able to map alt labels to correct recipes, e.g. searching for "pyaaz" should fetch recipes with "onion"


def defined_search_recipes(search_criteria, limit=50):
    recipes = ontology.FoodRecipes
    food_recipes_individuals = list(recipes.instances())
    recipes_data = []
    for recipe in food_recipes_individuals:
        recipe_info = {}
        # Extract the attributes of each recipe
        for prop in recipe.get_properties():

            # Get the recipe name (since it isn't an attribute in the current format)
            recipe_info['hasRecipeName'] = recipe.name

            # Get the name of the attribute (e.g. hasRecipeID), then fetch its value
            prop_name = prop.name

            values = getattr(recipe, prop.name)

            # If there's only one value, extract it directly, otherwise keep the list
            recipe_info[prop_name] = values[0] if len(values) == 1 else values

        recipes_data.append(recipe_info)

    recipe_df = pd.DataFrame(recipes_data)

    # Apply filters to dataframe based on search criteria

    for column, search_term in search_criteria.items():
        if column in recipe_df.columns:
            recipe_df = recipe_df[recipe_df[column].astype(
                str).str.contains(str(search_term), case=False, na=False)]
        else:
            # In case attribute not in dataframe
            print(f"Warning: Column '{column}' not found in DataFrame.")

    return recipe_df[0:limit]


# Test function:
# search = {'hasRecipeName':'Aloo', 'hasCuisine': 'Indian'}
# defined_search_recipes(search)

# Fuzzy-Match for Typos

# This function uses the same dataframe as in autocomplete, except only for ingredient instances
# To avoid a slow app loading time, the DF is being defined globally below:
# Function uses fuzzy match with a default threshold of 85 to suggest alternatives to any word that contains a typo
# Iterated through preferred labels first, and if no suggestions found, proceeds to check alt_labels.

# Further changes:
# Extending the typo-suggestions to other individuals/classes, e.g. cookware, techniques, cuisines

ing_df = pd.DataFrame(columns=["ingredient_name", "alt_labels"])
for individual in ontology.individuals():
    labels = []
    if ontology.FoodIngredients in individual.is_a[0].ancestors():
        if hasattr(individual, 'has_alt_labels'):
            for label in individual.has_alt_labels:
                if hasattr(label, 'lang'):
                    language = get_full_language_name(label.lang)
                    labels.append(f"{label}")
        ing_df = ing_df._append(
            {"ingredient_name": individual.name, "alt_labels": labels}, ignore_index=True)

ing_df['ingredient_name'] = ing_df['ingredient_name'].str.lower()


def typo_suggester(input_str, df, column_name, alt_lable_column, threshold=85, limit=3):

    choices = df[column_name].tolist()

    # Use fuzzy matching to get the best matches
    all_suggestions = process.extract(input_str, choices, limit=None)

    # Filter out suggestions that do not meet the threshold
    filtered_suggestions = [
        suggestion for suggestion in all_suggestions if suggestion[1] >= threshold]

    if filtered_suggestions:
        # Return the top suggestions. Can use a set to avoid redundancy in suggestions
        return [suggestion[0] for suggestion in filtered_suggestions[:limit]]

    else:
        print("No matches found in Preferred labels. Searching Alternate Labels")

        list_column_choices = df[alt_lable_column].explode().tolist()

        # Perform fuzzy matching on the second column (lists of strings)
        list_suggestions = process.extract(
            input_str, list_column_choices, limit=None)

        # Filter suggestions based on the threshold
        filtered_list_suggestions = [
            suggestion for suggestion in list_suggestions if suggestion[1] >= threshold]
        if filtered_list_suggestions:
            return [suggestion[0] for suggestion in filtered_list_suggestions[:limit]]

        else:
            return "No matches found."

# Test function on "pyaaazz":
# print(typo_suggester("pyaaazz", ing_df, "ingredient_name", "alt_labels"))


# Set up Flask app
app = Flask(__name__)


@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '').lower()
    arg_ingredients = request.args.get('only_ingredients')
    arg_recipes = request.args.get('only_recipes')
    alt_labels = request.args.get('alt_labels')

    suggestions = get_autocomplete_suggestions_str(
        query, ontology, arg_recipes, arg_ingredients)

    if suggestions.empty:
        return f"No results found for {query}"

    # print(suggestions)
    # This will print all ingredient-individuals with their alt_labels next to them, if alt_labels is True

    results = []
    if alt_labels == True:
        for _, row in suggestions.iterrows():
            if row['alt_labels'] != None:
                result = f"<strong>{row['name'].capitalize()}</strong> <i>{'Ingredient' if row['is_ingredient'] else 'Recipe'}</i> {row['alt_labels']}"
                results.append(result)
            else:
                result = f"<strong>{row['name'].capitalize()}</strong> <i>{'Ingredient' if row['is_ingredient'] else 'Recipe'}</i>"
                results.append(result)

    # If alt_labels==False, prints only the matching ingredient names (even if the autocomplete function found matches based on alt_labels)
    else:
        for _, row in suggestions.iterrows():
            result = f"<strong>{row['name'].capitalize()}</strong> <i>{'Ingredient' if row['is_ingredient'] else 'Recipe'}</i>"
            results.append(result)

    return '<br>'.join(results)


@app.route('/recipe-search', methods=['GET'])
def recipe_search():  # Fetches search criteria from URL (e.g. ?name=potato&cuisine=indian)

    param_mapping = {
        'name': 'hasRecipeName',
        'id': 'hasRecipeID',
        'url': 'hasRecipeURL',
        'preptime': 'hasPrepTime',
        'fermenttime': 'hasFermentTime',
        'cooktime': 'hasCookTime',
        'totaltime': 'hasTotalTime',
        'cuisine': 'hasCuisine',
        'course': 'hasCourse',
        'difficulty': 'hasDifficulty',
        'diet': 'hasDiet',
        'servings': 'hasServings',
        'instructions': 'hasInstructions',
        'descriptions': 'hasIngredientDescription',
        'ingredient': 'hasActualIngredients'
    }

    # Create a dictionary for the search query based on URL
    search = {
        param_mapping[key]: value
        for key, value in request.args.items()
        if key in param_mapping and value
    }

    search_results = defined_search_recipes(search)
    table_html = search_results.to_html(
        classes='table table-striped', index=False)
    num_rows = search_results.shape[0]

    return render_template_string('''
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Search Results</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    </head>
    <body>
        <div class="container">
            <h1 class="mt-5">Search Results</h1>
             <p>{{ num_rows }} recipes found.</p>
            <div class="table-responsive">
                {{ df_html|safe }}
            </div>
        </div>
    </body>
    </html>
    ''', df_html=table_html, num_rows=num_rows)


@app.route('/typo-suggester', methods=['GET'])
def suggest():
    typo = request.args.get('typo').lower()

    suggestions = typo_suggester(typo, ing_df, "ingredient_name", "alt_labels")

    return suggestions


if __name__ == '__main__':
    app.run(debug=True)
