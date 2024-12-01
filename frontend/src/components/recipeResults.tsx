import React from "react";

type RecipeResultsProps = {
  results: Array<{
    name: string;
    properties: {
      hasCookTime?: string[];
      hasActualIngredients?: string[];
      hasInstructions?: string[];
      hasCuisine?: string[];
      hasDiet?: string[];
      hasCourse?: string[];
    };
    type: string;
  }>;
};

const RecipeResults: React.FC<RecipeResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="p-4 text-xl text-indigo-600 font-semibold text-center">
        No Results Found.
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="font-bold text-2xl text-indigo-800 mb-6">
        Found {results.length} result(s) that match your search.
      </h2>
      <div className="grid gap-6">
        {results.map((recipe, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-md shadow-md">
            <h3 className="font-bold text-xl text-indigo-700 mb-2">{recipe.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Type: {recipe.type || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Cook Time: {recipe.properties?.hasCookTime?.[0] || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Cuisine: {recipe.properties?.hasCuisine?.[0] || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Diet: {recipe.properties?.hasDiet?.[0] || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Course: {recipe.properties?.hasCourse?.[0] || "N/A"}
            </p>
            <div className="mt-2">
              <h4 className="font-semibold text-md text-gray-800">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {Array.isArray(recipe.properties?.hasActualIngredients) &&
                recipe.properties.hasActualIngredients.length > 0 ? (
                  recipe.properties.hasActualIngredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {ingredient}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-700">No ingredients available</li>
                )}
              </ul>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-md text-gray-800">Instructions:</h4>
              <p className="text-sm text-gray-700">
                {recipe.properties?.hasInstructions?.[0] || "No instructions available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeResults;
