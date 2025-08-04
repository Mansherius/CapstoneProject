"use client";

import React, { useState } from "react";
import SpecificRecipeForm from "@/components/SpecificRecipeForm";
import RecipeResults from "@/components/recipeResults";
import { Tooltip } from "@/components/ui/toolTip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type RecipeResult = {
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
};

const FormsQuery = () => {
	const [results, setResults] = useState<RecipeResult[]>([]);
	const [useCase, setUseCase] = useState<"byName" | "byDetails">("byDetails");
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Search by name function
	const handleSearchByName = async () => {
		const mainIngredients = (document.getElementById("mainIngredientsInput") as HTMLInputElement)?.value || "";
		const allergens = (document.getElementById("allergensInput") as HTMLInputElement)?.value || "";
	  
		console.log("Searching by Recipe Name:", searchQuery);
		console.log("Main Ingredients:", mainIngredients);
		console.log("Allergens:", allergens);
	  
		setIsLoading(true);
	  
		try {
		  const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE}/api/search-by-name`,
			{
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				name: searchQuery,
				mainIngredients: mainIngredients.split(",").map((i) => i.trim()),
				allergens: allergens.split(",").map((i) => i.trim()),
			  }),
			}
		  );
	  
		  if (!response.ok) {
			throw new Error("Failed to fetch search results");
		  }
	  
		  const data = await response.json();
	  
		  const formattedResults: RecipeResult[] = data.map((item: Record<string, any>) => ({
			name: item.name,
			properties: item.properties || {}, // Dynamically include all properties
			type: item.type || "N/A",
		  }));
	  
		  setResults(formattedResults);
		} catch (error) {
		  console.error("Error searching for recipes:", error);
		  setResults([]); // Clear results on error
		} finally {
		  setIsLoading(false);
		}
	  };
	  

	// Handle form submission from SpecificRecipeForm
	const handleSearchByDetails = async (formData: any) => {
		console.log("Searching by Dish Properties:", formData);
		setIsLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/search-by-details`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch search results");
			}

			const data = await response.json();

			// Map backend response dynamically to include all properties
			const formattedResults: RecipeResult[] = data.map((item: Record<string, any>) => ({
				name: item.name,
				properties: item.properties || {}, // Dynamically include all properties
				type: item.type || "N/A",
			}));

			setResults(formattedResults);
		} catch (error) {
			console.error("Error searching for recipes:", error);
			setResults([]); // Clear results on error
		} finally {
			setIsLoading(false);
		}
	};

	// Function to reload the page
	const handleReset = () => {
		window.location.reload();
	};

	return (
		<TooltipProvider>
			<div className="p-5 bg-white rounded-lg shadow-md">
				{/* Welcome Section */}
				<div className="bg-indigo-100 p-6 rounded-md shadow-md mb-6 text-center">
					<h1 className="font-bold text-5xl text-indigo-800 mb-4">Masala Match</h1>
					<h2 className="font-bold text-4xl text-indigo-800 mb-4">
						Welcome to Your Recipe Finder!
					</h2>
					<p className="text-lg text-gray-700 px-8">
						Ready to discover your next favorite dish? Simply fill out the
						details below, and we&apos;ll handle the rest!
					</p>
				</div>

				{/* Search Options */}
				<div className="text-center mb-6">
					<div className="flex justify-center space-x-4">
						<Tooltip content="Search recipes by their name.">
							<button
								className={`py-2 px-4 rounded-md ${
									useCase === "byName"
										? "bg-indigo-600 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
								onClick={() => setUseCase("byName")}
							>
								Search by Recipe Name
							</button>
						</Tooltip>
						<Tooltip content="Search recipes based on specific properties.">
							<button
								className={`py-2 px-4 rounded-md ${
									useCase === "byDetails"
										? "bg-indigo-600 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
								onClick={() => setUseCase("byDetails")}
							>
								Search by Dish Properties
							</button>
						</Tooltip>
					</div>
				</div>

				{/* Search Forms */}
				<div className="mb-6">
  {useCase === "byName" ? (
    <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto">
      {/* Recipe Name Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type a recipe name..."
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Main Ingredients Input */}
      <input
        type="text"
        id="mainIngredientsInput"
        placeholder="Main ingredients (comma-separated)..."
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Allergens Input */}
      <input
        type="text"
        id="allergensInput"
        placeholder="Allergens to exclude (comma-separated)..."
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Search Button */}
      <button
        onClick={() => handleSearchByName()}
        disabled={isLoading}
        className={`bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-500 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Loading..." : "Search"}
      </button>
    </div>
  ) : (
    <SpecificRecipeForm onFormSubmit={handleSearchByDetails} />
  )}
</div>


				{/* Reset Button */}
				<div className="text-center mb-6">
					<button
						className="bg-indigo-800 text-indigo-300 font-bold py-3 px-6 rounded hover:bg-indigo-600"
						onClick={handleReset}
					>
						Reset Search
					</button>
				</div>

				{/* Results */}
				<div className="w-full max-w-2xl mx-auto overflow-auto">
					<RecipeResults results={results} />
				</div>
			</div>
		</TooltipProvider>
	);
};

export default FormsQuery;
