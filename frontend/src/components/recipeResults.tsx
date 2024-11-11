import React from "react";

type RecipeResultsProps = {
  results: Array<{
    name: string;
    description: string;
    cookTime: string;
    ingredients: string[];
  }>;
};

const RecipeResults: React.FC<RecipeResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No results found. Please adjust your search criteria and try again.
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="font-bold text-2xl text-indigo-800 mb-6">
        Found {results.length} results that match your search.
      </h2>
      <div className="grid gap-6">
        {results.map((recipe, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-md shadow-md">
            <h3 className="font-bold text-xl text-indigo-700 mb-2">{recipe.name}</h3>
            <p className="text-md text-gray-700 mb-2">{recipe.description}</p>
            <p className="text-sm text-gray-500 mb-2">Cook Time: {recipe.cookTime}</p>
            <div className="mt-2">
              <h4 className="font-semibold text-md text-gray-800">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeResults;
