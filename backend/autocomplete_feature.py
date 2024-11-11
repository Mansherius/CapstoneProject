from flask import Flask, request, jsonify, render_template_string
from owlready2 import get_ontology, default_world
from fuzzywuzzy import process
import pandas as pd
import re

ontology = get_ontology('/Users/manshersingh/Documents/Coding Projects/capstoneProject/data/cleaned_output.owl').load()

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

# Autocomplete Suggestions: Returns matching names of Recipes or Ingredients for a given query

# Takes an input string (e.g. "ok") and returns all matches that begin with the string, e.g:
    # Okara ['soya pulp'] # Where ['soya pulp'] is an alt_label
    # Okra bamia recipe
    # Okra idli recipe (ladyfinger idli)

# Will output only recipe matches if only_recipes = True, or only ingredients if only_ing = True.
# This function currently builds a dataframe containing all Food individuals (ingredients and recipes)
# The DF contains information about whether the individual is an ingredient, and if yes, contains an array of the ingredient's alt_labels
# Each locstr-formatted alt_label is appended with its full language name.
# If the string cannot be matched in the main Food column, the function will check through all alt labels for matches and return those.

# Further changes: Can do a direct Food (preferred label) and alterantive label search, and can take dataframe creation outside function
# so that webpage loading time is faster.


def get_autocomplete_suggestions_str(input_str, ontology, only_recipes, only_ing):
    ing_recipe_df = pd.DataFrame(
        columns=["name", "is_ingredient", "alt_labels"])
    for individual in ontology.individuals():
        labels = []
        if ontology.FoodIngredients in individual.is_a[0].ancestors():
            if hasattr(individual, 'has_alt_labels'):
                for label in individual.has_alt_labels:
                    if hasattr(label, 'lang'):
                        language = get_full_language_name(label.lang)
                        labels.append(f"{label} ({language})")
                    else:
                        labels.append(f"{label}")
            ing_recipe_df = ing_recipe_df._append(
                {"name": individual.name, "is_ingredient": True, "alt_labels": labels}, ignore_index=True)
        else:
            ing_recipe_df = ing_recipe_df._append(
                {"name": individual.name, "is_ingredient": False, "alt_labels": None}, ignore_index=True)

    ing_recipe_df['name'] = ing_recipe_df['name'].str.lower()
    ing_recipe_df['alt_labels'] = ing_recipe_df['alt_labels'].apply(
        lambda x: [i.lower() for i in x] if x else None)
    ing_recipe_df['alt_labels'] = ing_recipe_df['alt_labels'].apply(
        lambda x: None if x == [] else x)

    if only_recipes:
        ing_recipe_df = ing_recipe_df[ing_recipe_df['is_ingredient'] == False]

    if only_ing:
        ing_recipe_df = ing_recipe_df[ing_recipe_df['is_ingredient'] == True]

    matches = ing_recipe_df[ing_recipe_df['name'].str.match(
        rf'^{str.lower(input_str)}')]

    # If no matches in preferred labels, searches through alt_labels

    if matches.empty:
        matches = ing_recipe_df[ing_recipe_df['alt_labels'].apply(
            lambda x: any(input_str in match for match in x) if isinstance(x, list) else False)]

    return matches

# Test function:
# print(get_autocomplete_suggestions_str("cho", ontology, True, False))


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


if __name__ == '__main__':
    app.run(debug=True)
