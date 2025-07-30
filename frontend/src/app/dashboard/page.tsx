import React from 'react';

const Instructions = () => {
  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
				<div className="bg-indigo-100 p-6 rounded-md shadow-md mb-6 text-center">
					<h2 className="font-bold text-4xl text-indigo-800 mb-4">
          How to Use the Food Knowledge Graph (FKG)
					</h2>
				</div>
      
      {/* Search by Name Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Search by Name</h2>
        <p className="mb-4">
          This method allows you to search for recipes directly by their name. You can also include ingredients and allergens to refine the results. Keep in mind that this method uses an <span className="font-bold">OR logic</span>, meaning results will include recipes matching any of the criteria.
        </p>
        <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
        <ul className="list-disc pl-6">
          <li>
            Type the name of the recipe or a keyword to find relevant recipes. For instance, searching for <span className="font-bold">&quot;Chickpea Curry&quot;</span> will return all recipes with similar names.
          </li>
          <li>
            Add ingredients or allergens to broaden or refine your results. For example, adding <span className="font-bold">&quot;Peanuts&quot;</span> as an allergen will exclude recipes containing peanuts in any form.
          </li>
          <li>
            Useful for quickly locating specific recipes without detailed filtering.
          </li>
        </ul>
        <p className="mt-4">
          <span className="font-bold">Considerations:</span> This search method is more flexible but may return broader results compared to &quot;Search by Dish Properties.&quot;
        </p>
      </div>

      {/* Search by Dish Properties Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Search by Dish Properties</h2>
        <p className="mb-4">
          This method allows you to perform a detailed search using multiple parameters like ingredients, allergens, cook time, cuisine, and more. It uses <span className="font-bold">AND logic</span>, meaning all specified criteria must be satisfied for a recipe to appear in the results.
        </p>
        <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
        <ul className="list-disc pl-6">
          <li>
            <span className="font-bold">Ingredient Search:</span> Find recipes based on preferred labels, alternate labels, or scientific names. For example, searching for <span className="font-bold">&quot;Maida&quot;</span> will include recipes with &quot;All Purpose Flour (Maida).&quot;
          </li>
          <li>
            <span className="font-bold">Allergen Exclusion:</span> Add allergens to ensure recipes containing those ingredients are excluded. This functionality takes absolute precedence.
          </li>
          <li>
            <span className="font-bold">Additional Filters:</span> Refine your search with parameters like cook time, cuisine, diet, difficulty, and course.
          </li>
          <li>
            This method is best suited for creating complex, precise queries.
          </li>
        </ul>
        <p className="mt-4">
          <span className="font-bold">Considerations:</span> Be specific with your inputs to get the most accurate results. For instance, use <span className="font-bold">&quot;Green Peas&quot;</span> instead of just <span className="font-bold">&quot;Peas.&quot;</span> {" "}
            Furthermore, whenever you want to search using more details, you need to select one item from the chip selectors, then click on the <span className='font-bold'>&quot;Add more details&quot;</span> button and then choose from the new chip selectors.
        </p>
      </div>

      {/* API Endpoints Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">API Endpoints</h2>
        <p className="mb-4">
          For developers integrating the FKG into other applications, the following API endpoints are available:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <span className="font-bold">/api/search-by-name:</span> Perform quick OR-based searches by recipe name, ingredients, and allergens.
          </li>
          <li>
            <span className="font-bold">/api/search-by-details:</span> Use detailed filters for an AND-based search.
          </li>
          <li>
            <span className="font-bold">/api/unique-values:</span> Fetch unique values for dropdowns like cuisines and diets.
          </li>
          <li>
            <span className="font-bold">/api/resolve-ingredient:</span> Resolve an ingredient to its parent entity or preferred label.
          </li>
        </ul>
      </div>

      {/* Best Practices Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Best Practices for Querying</h2>
        <ul className="list-disc pl-6">
          <li>
            Be specific with ingredient names for more accurate results. For example, use <span className="font-bold">&quot;Green Peas&quot;</span> instead of <span className="font-bold">&quot;Peas.&quot;</span>
          </li>
          <li>
            Use the allergen filter thoughtfully to ensure safe recipes for dietary restrictions.
          </li>
          <li>
            Combine multiple filters for complex queries, such as finding gluten-free recipes under 30 minutes.
          </li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <p className="text-sm italic">
          For support or feedback, contact us at{' '}
          <a href="mailto:mansher.singh_asp25@ashoka.edu.in" className="text-indigo-600">
            mansher.singh.2025@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Instructions;
