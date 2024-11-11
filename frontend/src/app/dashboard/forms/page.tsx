"use client";

import React, { useState, useEffect } from "react";
import SpecificRecipeForm from "@/components/SpecificRecipeForm";
import RecipeResults from "@/components/recipeResults";

type RecipeResult = {
  name: string;
  description: string;
  cookTime: string;
  ingredients: string[];
};

const FormsQuery = () => {
  const [results, setResults] = useState<RecipeResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<RecipeResult[]>([]);

  const handleFormSubmit = (formData: { parameter: string; value: string; values: string[]; avoidValues: string[] }[]) => {
    console.log("Form Data Submitted:", formData);
    // Simulate fetching results based on form data
    const fetchedResults: RecipeResult[] = [
      {
        name: "Spicy Tomato Pasta",
        description: "A delicious and spicy pasta dish made with fresh tomatoes and herbs.",
        cookTime: "30 minutes",
        ingredients: ["Tomatoes", "Garlic", "Pasta", "Chili Flakes", "Basil"],
      },
      {
        name: "Vegetable Stir Fry",
        description: "A quick and healthy stir fry made with seasonal vegetables.",
        cookTime: "20 minutes",
        ingredients: ["Broccoli", "Carrot", "Bell Pepper", "Soy Sauce", "Garlic"],
      },
    ];
    setResults(fetchedResults);
  };

  useEffect(() => {
    // Filter results based on form data
    const filtered = results.filter((recipe) => {
      const ingredientsToMatch = results.flatMap((r) => r.ingredients);
      return recipe.ingredients.every((ingredient) => ingredientsToMatch.includes(ingredient));
    });
    setFilteredResults(filtered);
  }, [results]);

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <main className="flex flex-col gap-2">
        <SpecificRecipeForm onFormSubmit={handleFormSubmit} />
        <div className="text-lg text-gray-700 mb-4">
          Found {filteredResults.length} results that match your search.
        </div>
        <RecipeResults results={filteredResults} />
      </main>
    </div>
  );
};

export default FormsQuery;
