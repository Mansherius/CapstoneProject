from owlready2 import get_ontology

# Load ontology once and reuse across all endpoints
ONTOLOGY_PATH = '/Users/manshersingh/Documents/Coding Projects/capstoneProject/data/final_ifct_csv_json.owl'

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
