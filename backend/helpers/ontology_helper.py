from owlready2 import get_ontology

# Load ontology once and reuse across all endpoints
ONTOLOGY_PATH = '/Users/manshersingh/Documents/Coding Projects/capstoneProject/data/final_ifct_csv_json.owl'

def load_ontology():
    """Load the ontology file."""
    ontology = get_ontology(ONTOLOGY_PATH).load()
    return ontology

# Reuse the loaded ontology
ontology = load_ontology()
