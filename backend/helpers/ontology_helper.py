import os
from owlready2 import get_ontology

# Get absolute path to the *project root* (i.e., capstoneProject/)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Build the full path to the ontology file
DEFAULT_PATH = os.path.join(PROJECT_ROOT, "data", "final_ifct_csv_json.owl")

# Use env var if set, otherwise default to constructed path
ONTOLOGY_PATH = os.getenv("ONTOLOGY_PATH", DEFAULT_PATH)

def load_ontology():
    """Load the ontology file."""
    ontology = get_ontology(ONTOLOGY_PATH).load()
    return ontology

def format_recipe_data(individual):
    """
    Formats the recipe data for a given ontology individual.

    Args:
        individual: The ontology individual representing a recipe.

    Returns:
        dict: A dictionary containing the formatted recipe data.
    """
    return {
        "name": individual.name,
        "type": "Recipe",
        "properties": {
            prop.python_name: [str(v) for v in prop[individual]]
            for prop in individual.get_properties()
        },
    }

# Reuse the loaded ontology
ontology = load_ontology()
