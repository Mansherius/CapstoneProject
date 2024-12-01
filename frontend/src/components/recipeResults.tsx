import React from "react";

type RecipeResultsProps = {
  results: Array<{
    name: string;
    properties: {
      hasCookTime?: string[];
      hasActualIngredients?: string[];
      hasInstructions?: string[];
      hasIngredientDescription?: string[];
      hasCuisine?: string[];
      hasDiet?: string[];
      hasCourse?: string[];
      hasRecipeURL?: string[];
      hasServings?: string[];
      hasDifficulty?: string[];
      hasPrepTime?: string[];
      hasTotalTime?: string[];
    };
    type: string;
  }>;
};

const parseComplexJson = (data: string) => {
  try {
    const cleanedData = data
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/\\\"/g, '\\"') // Escape inner quotes
      .replace(/\\'/g, "'"); // Restore escaped single quotes
    return JSON.parse(cleanedData);
  } catch (error) {
    console.error("Error parsing complex JSON:", error, data);
    return null;
  }
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
        Found {results.length} results that match your search.
      </h2>
      <div className="grid gap-6">
        {results.map((recipe, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-md shadow-md">
            {/* Recipe Name */}
            <h3 className="font-bold text-xl text-indigo-700 mb-4">
              {recipe.name}
            </h3>

            {/* Inline Properties */}
            <div className="text-sm text-gray-700 mb-4">
              {recipe.properties.hasCuisine?.[0] && (
                <p>
                  <strong>Cuisine:</strong> {recipe.properties.hasCuisine[0]}
                </p>
              )}
              {recipe.properties.hasDiet?.[0] && (
                <p>
                  <strong>Diet:</strong> {recipe.properties.hasDiet[0]}
                </p>
              )}
              {recipe.properties.hasDifficulty?.[0] && (
                <p>
                  <strong>Difficulty Level:</strong> {recipe.properties.hasDifficulty[0]}
                </p>
              )}
              {recipe.properties.hasCourse?.[0] && (
                <p>
                  <strong>Course:</strong> {recipe.properties.hasCourse[0]}
                </p>
              )}
              {recipe.properties.hasCookTime?.[0] && (
                <p>
                  <strong>Cook Time:</strong> {recipe.properties.hasCookTime[0]}
                </p>
              )}
              {recipe.properties.hasPrepTime?.[0] && (
                <p>
                  <strong>Prep Time:</strong> {recipe.properties.hasPrepTime[0]}
                </p>
              )}
              {recipe.properties.hasTotalTime?.[0] && (
                <p>
                  <strong>Total Time:</strong> {recipe.properties.hasTotalTime[0]}
                </p>
              )}
            </div>

            {/* Ingredient Description */}
            {recipe.properties.hasIngredientDescription?.length && (
              <div className="mb-4">
                {recipe.properties.hasIngredientDescription.map((desc, idx) => {
                  const parsed = parseComplexJson(desc);
                  return parsed ? (
                    parsed.map((group: any, groupIdx: number) => (
                      <div key={groupIdx}>
                        <h5 className="font-bold text-indigo-700">
                          {group.heading}
                        </h5>
                        {group.items && Object.entries(group.items).length > 0 ? (
                          <ul className="list-disc list-inside">
                            {Object.entries(group.items).map(
                              ([item, details]: any, itemIdx) => (
                                <li key={itemIdx} className="text-sm">
                                  <span className="font-semibold">{item}</span>
                                  {details.form ? `: ${details.form}` : ""}
                                  {details.quantity
                                    ? ` - ${details.quantity} ${details.unit || ""}`
                                    : ""}
                                  {details.notes ? ` (${details.notes})` : ""}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No detailed items available for {group.heading}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p key={idx} className="text-gray-700">
                      Unable to parse ingredient description
                    </p>
                  );
                })}
              </div>
            )}

            {/* Instructions */}
            {recipe.properties.hasInstructions?.length && (
              <div className="mb-4">
                {recipe.properties.hasInstructions.map((instruction, idx) => {
                  const parsed = parseComplexJson(instruction);
                  return parsed ? (
                    parsed.map((step: any, stepIdx: number) => (
                      <div key={stepIdx} className="mb-4">
                        <h5 className="font-bold text-indigo-700">
                          {step.heading}
                        </h5>
                        <p className="text-gray-700">{step.instructions}</p>
                      </div>
                    ))
                  ) : (
                    <p key={idx} className="text-gray-700">
                      Unable to parse instructions
                    </p>
                  );
                })}
              </div>
            )}

            {/* Recipe URL */}
            {recipe.properties.hasRecipeURL?.[0] && (
              <div className="mb-4">
                <h4 className="font-semibold text-md text-indigo-600">
                  Find the Recipe online:
                </h4>
                <a
                  href={recipe.properties.hasRecipeURL[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {recipe.properties.hasRecipeURL[0]}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeResults;
