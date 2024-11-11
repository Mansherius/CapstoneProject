"use client";

import React, { useState } from "react";
import ChipSelector from "@/components/ui/chipSelector";
import { AutocompletePopover } from "@/components/ui/popover";
import { PlusIcon } from "@radix-ui/react-icons";

// Define a type for parameter value pairs
type ParameterValuePair = {
  parameter: string;
  value: string;
  values: string[];
  avoidValues: string[];
};

type EnhancedRecipeFormProps = {
  onFormSubmit: (formData: ParameterValuePair[]) => void;
};

const parameterOptions = ["Ingredient", "Cook Time", "Cuisine", "Diet", "Serving Size", "Difficulty", "Course"];
const ingredientOptions = ["Bajra", "Halloumi Cheese", "Tomatoes", "Red Bell Pepper", "Garlic", "Parsley Leaves"];
const cuisineOptions = ["Fusion", "Italian", "Indian", "Chinese", "Mexican", "French"];
const dietOptions = ["Vegetarian", "Eggetarian", "Vegan", "Non-Vegetarian"];
const courseOptions = ["Appetizer", "Main Course", "Dessert"];
const difficultyOptions = ["Easy", "Medium", "Hard"];

const EnhancedRecipeForm: React.FC<EnhancedRecipeFormProps> = ({ onFormSubmit }) => {
  const [parameterValuePairs, setParameterValuePairs] = useState<ParameterValuePair[]>([
    { parameter: "Ingredient", value: "", values: [] as string[], avoidValues: [] as string[] },
  ]);

  const addParameter = () => {
    setParameterValuePairs([...parameterValuePairs, { parameter: "", value: "", values: [], avoidValues: [] }]);
  };

  const handleParameterSelect = (index: number, parameter: string) => {
    const updatedPairs = [...parameterValuePairs];
    updatedPairs[index] = { parameter, value: "", values: [], avoidValues: [] };
    setParameterValuePairs(updatedPairs);
  };

  const handleValueSelect = (index: number, value: string) => {
    const updatedPairs = [...parameterValuePairs];
    updatedPairs[index] = { ...updatedPairs[index], value };
    setParameterValuePairs(updatedPairs);
  };

  const handleIngredientInputChange = (index: number, input: string) => {
    const updatedPairs = [...parameterValuePairs];
    const values: string[] = input.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
    updatedPairs[index] = { ...updatedPairs[index], values };
    setParameterValuePairs(updatedPairs);
  };

  const handleAvoidInputChange = (index: number, input: string) => {
    const updatedPairs = [...parameterValuePairs];
    const avoidValues: string[] = input.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
    updatedPairs[index] = { ...updatedPairs[index], avoidValues };
    setParameterValuePairs(updatedPairs);
  };

  const handleCookTimeChange = (index: number, value: string) => {
    const updatedPairs = [...parameterValuePairs];
    updatedPairs[index] = { ...updatedPairs[index], value: `${value} minutes` };
    setParameterValuePairs(updatedPairs);
  };

  const handleSubmit = () => {
    onFormSubmit(parameterValuePairs);
  };

  return (
    <div className="p-4">
      {/* Intuitive Welcome Section */}
      <div className="bg-indigo-100 p-6 rounded-md shadow-md mb-6">
        <h2 className="font-bold text-4xl text-indigo-800 mb-4">Welcome to Your Recipe Finder!</h2>
        <p className="text-lg text-gray-700">
          Ready to discover your next favorite dish? Let's personalize your search so you can find exactly what you're craving. Simply fill out the details below, and we'll handle the rest!
        </p>
      </div>

      <div className="font-bold text-3xl text-indigo-700 mb-4">Find a Specific Recipe</div>
      {parameterValuePairs.map((pair, index) => (
        <div key={index} className="my-6 p-4 rounded-md bg-gray-50 shadow-md">
          <p className="text-md text-gray-700 mb-2">
            {index === 0
              ? "How are we deciding what to look for today?"
              : "Is there anything else you'd like to specify (e.g., Cook Time, Cuisine, Difficulty)?"}
          </p>

          <div className="flex flex-col space-y-2">
            <ChipSelector
              options={parameterOptions}
              selectedValue={pair.parameter}
              onSelect={(parameter) => handleParameterSelect(index, parameter)}
              placeholder="Select Parameter"
            />

            {pair.parameter === "Ingredient" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">
                  Please enter the ingredients you want, separated by commas:
                </p>
                <input
                  type="text"
                  className="w-42 p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Bajra, Tomatoes, Garlic"
                  onChange={(e) => handleIngredientInputChange(index, e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {pair.values &&
                    pair.values.map((ingredient, idx) => (
                      <div
                        key={idx}
                        className="bg-indigo-200 text-indigo-700 py-1 px-3 rounded-full"
                      >
                        {ingredient}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {pair.parameter === "Cook Time" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">
                  Select the desired cook time (in minutes):
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={5}
                    max={120}
                    step={1}
                    value={parseInt(pair.value) || 30}
                    onChange={(e) => handleCookTimeChange(index, e.target.value)}
                    className="w-1/3"
                  />
                  <input
                    type="number"
                    className="w-36 p-2 border border-gray-300 rounded-md"
                    value={parseInt(pair.value) || 30}
                    onChange={(e) => handleCookTimeChange(index, e.target.value)}
                  />
                </div>
              </div>
            )}

            {pair.parameter === "Cuisine" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">
                  What type of cuisine are you in the mood for? Maybe something exotic or comforting? Start typing to see suggestions or pick one below:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cuisineOptions.map((cuisine, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleValueSelect(index, cuisine)}
                      className="bg-indigo-200 text-indigo-700 py-1 px-3 rounded-full hover:bg-indigo-300"
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
                <AutocompletePopover
                  options={cuisineOptions}
                  onSelect={(value) => handleValueSelect(index, value)}
                  placeholder="e.g., Italian, Indian, Chinese"
                />
              </div>
            )}

            {pair.parameter === "Diet" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">Select dietary preferences:</p>
                <ChipSelector
                  options={dietOptions}
                  selectedValue={pair.value}
                  onSelect={(value) => handleValueSelect(index, value)}
                />
              </div>
            )}

            {pair.parameter === "Course" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">Select the course of the meal:</p>
                <ChipSelector
                  options={courseOptions}
                  selectedValue={pair.value}
                  onSelect={(value) => handleValueSelect(index, value)}
                />
              </div>
            )}

            {pair.parameter === "Difficulty" && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2">Select the difficulty level:</p>
                <ChipSelector
                  options={difficultyOptions}
                  selectedValue={pair.value}
                  onSelect={(value) => handleValueSelect(index, value)}
                />
              </div>
            )}

            {index === 0 && (
              <div className="mt-4">
                <p className="text-md text-gray-700 mb-2 font-bold">
                  Are there any allergens or ingredients you want to avoid?
                </p>
                <input
                  type="text"
                  className="w-60 p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Nuts, Dairy, Soy"
                  onChange={(e) => handleAvoidInputChange(index, e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {pair.avoidValues &&
                    pair.avoidValues.map((avoidItem, idx) => (
                      <div
                        key={idx}
                        className="bg-red-200 text-red-700 py-1 px-3 rounded-full"
                      >
                        {avoidItem}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={addParameter}
          className="flex items-center space-x-1 text-indigo-700 hover:text-indigo-500"
        >
          <PlusIcon /> <span>Add more details</span>
        </button>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-indigo-800 text-indigo-300 font-bold py-3 px-6 rounded hover:bg-indigo-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EnhancedRecipeForm;
