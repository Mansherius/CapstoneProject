from owlready2 import get_ontology

# Load your ontology
ontology_path = "/Users/manshersingh/Documents/Coding Projects/capstoneProject/data/final_ifct_csv_json.owl"
onto = get_ontology(ontology_path).load()

# List of properties to extract unique values for
properties_to_extract = {"hasDiet", "hasCuisine", "hasDifficulty", "hasCourse"}

def extract_specific_unique_values():
    unique_values = {prop: set() for prop in properties_to_extract}

    for individual in onto.individuals():
        for prop in individual.get_properties():
            prop_name = prop.python_name  # Get property name

            # Check if the property is one we're interested in
            if prop_name in properties_to_extract:
                prop_values = [str(value) for value in prop[individual]]  # Extract all values
                unique_values[prop_name].update(prop_values)  # Add to the set

    # Convert sets to lists for JSON serialization or printing
    unique_values = {key: sorted(list(value)) for key, value in unique_values.items()}

    return unique_values

if __name__ == "__main__":
    specific_unique_values = extract_specific_unique_values()

    # Print unique values for each specified property
    for prop, values in specific_unique_values.items():
        print(f"Property: {prop}")
        print(f"Unique Values: {values}")
        print("-" * 50)
