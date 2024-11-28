"use client";

import React, { useState } from "react";
import SpecificRecipeForm from "@/components/SpecificRecipeForm";
import RecipeResults from "@/components/recipeResults";
import { Tooltip } from "@/components/ui/toolTip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type RecipeResult = {
	name: string;
	description: string;
	cookTime: string;
	ingredients: string[];
};

const FormsQuery = () => {
	const [results, setResults] = useState<RecipeResult[]>([]);
	const [filteredResults, setFilteredResults] = useState<RecipeResult[]>([]);
	const [useCase, setUseCase] = useState<"byName" | "byDetails">("byDetails");
	const [searchQuery, setSearchQuery] = useState("");

	const handleFormSubmit = (
		formData: {
			parameter: string;
			value: string;
			values: string[];
			avoidValues: string[];
		}[]
	) => {
		console.log("Form Data Submitted:", formData);

		// Simulate fetching results based on form data
		const fetchedResults: RecipeResult[] = [
			{
				name: "Spicy Tomato Pasta",
				description:
					"A delicious and spicy pasta dish made with fresh tomatoes and herbs.",
				cookTime: "30 minutes",
				ingredients: ["Tomatoes", "Garlic", "Pasta", "Chili Flakes", "Basil"],
			},
			{
				name: "Vegetable Stir Fry",
				description:
					"A quick and healthy stir fry made with seasonal vegetables.",
				cookTime: "20 minutes",
				ingredients: [
					"Broccoli",
					"Carrot",
					"Bell Pepper",
					"Soy Sauce",
					"Garlic",
				],
			},
		];
		setResults(fetchedResults);
		setFilteredResults(fetchedResults);
	};

	const [isLoading, setIsLoading] = useState(false);

	const handleSearchByName = async () => {
    console.log("Searching by Recipe Name:", searchQuery);
    setIsLoading(true); // Start loading
  
    try {
      // Simulate backend request
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
  
      const data: RecipeResult[] = await response.json();
      setFilteredResults(data); // Update results
    } catch (error) {
      console.error("Error searching for recipes:", error);
      setFilteredResults([]); // Clear results on error
    } finally {
      setIsLoading(false); // End loading
    }
  };
  

	return (
    <TooltipProvider>
		<div className="p-5 bg-white rounded-lg shadow-md">
			{/* Intuitive Welcome Section */}
			<div className="bg-indigo-100 p-6 rounded-md shadow-md mb-6 text-center">
        <h1 className="font-bold text-5xl text-indigo-800 mb-4">
          Insert Temp Name
        </h1>
				<h2 className="font-bold text-4xl text-indigo-800 mb-4">
					Welcome to Your Recipe Finder!
				</h2>
				<p className="text-lg text-gray-700 px-8">
					Ready to discover your next favorite dish? Let's personalize your
					search so you can find exactly what you're craving. Simply fill out
					the details below, and we'll handle the rest!
				</p>
			</div>

			{/* Prompt and Toggles */}
			<div className="text-center mb-6">
				<p className="text-lg text-gray-700  font-semibold px-8 mb-4">
					Looking for a specific recipe? Use the{" "}
					<span className="font-bold text-indigo-600">Search by Recipe Name</span>{" "}
					option. 
          </p>
          <p className="text-lg text-gray-700  font-semibold px-8 mb-4">
          Unsure what to cook with your ingredients? Try{" "}
					<span className="font-bold text-indigo-600">Search by Dish Properties</span>
					.
				</p>
				<div className="flex justify-center space-x-4">
          <Tooltip content="Go to the instructions on the Dashboard if don't know how to proceed">
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
          <Tooltip content="Go to the instructions on the Dashboard if don't know how to proceed">
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

			{/* Use Case Rendering */}
			<div className="mb-6">
				{useCase === "byName" ? (
					<div className="flex flex-col items-center w-full">
          <div className="flex items-center w-full max-w-2xl mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a recipe name..."
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-[48px]"
            />
            <button
              onClick={handleSearchByName}
              disabled={isLoading} // Disable the button while loading
              className={`bg-indigo-600 text-white py-3 px-6 rounded-r-md hover:bg-indigo-500 h-[48px] min-w-[120px] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>        
				) : (
					<SpecificRecipeForm onFormSubmit={handleFormSubmit} />
				)}
			</div>

			{/* Results Section */}
			<div className="w-full max-w-2xl mx-auto">
				<RecipeResults results={filteredResults} />
			</div>
		</div>
    </TooltipProvider>
	);
};

export default FormsQuery;
