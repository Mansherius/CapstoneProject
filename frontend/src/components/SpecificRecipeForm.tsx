"use client";

import React, { useState } from "react";
import ChipSelector from "@/components/ui/chipSelector";
import { AutocompletePopover } from "@/components/ui/popover";
import { PlusIcon } from "@radix-ui/react-icons";
import { Tooltip } from "@/components/ui/toolTip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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

const parameterOptions = [
	"Ingredient",
	"Cook Time",
	"Cuisine",
	"Diet",
	"Difficulty",
	"Course",
];
const ingredientOptions = [
	"Bajra",
	"Halloumi Cheese",
	"Tomatoes",
	"Red Bell Pepper",
	"Garlic",
	"Parsley Leaves",
];
const cuisineOptions = [
	"Fusion",
	"Italian",
	"Indian",
	"Chinese",
	"Mexican",
	"French",
];
const dietOptions = ["Vegetarian", "Eggetarian", "Vegan", "Non-Vegetarian"];
const courseOptions = ["Appetizer", "Main Course", "Dessert"];
const difficultyOptions = ["Easy", "Medium", "Hard"];

const EnhancedRecipeForm: React.FC<EnhancedRecipeFormProps> = ({
	onFormSubmit,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const [parameterValuePairs, setParameterValuePairs] = useState<
		ParameterValuePair[]
	>([
		{
			parameter: "Ingredient",
			value: "",
			values: [] as string[],
			avoidValues: [] as string[],
		},
	]);

	const addParameter = () => {
		setParameterValuePairs([
			...parameterValuePairs,
			{ parameter: "", value: "", values: [], avoidValues: [] },
		]);
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
		const values: string[] = input
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
		updatedPairs[index] = { ...updatedPairs[index], values };
		setParameterValuePairs(updatedPairs);
	};

	const handleAvoidInputChange = (index: number, input: string) => {
		const updatedPairs = [...parameterValuePairs];
		const avoidValues: string[] = input
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
		updatedPairs[index] = { ...updatedPairs[index], avoidValues };
		setParameterValuePairs(updatedPairs);
	};

	const handleCookTimeChange = (index: number, value: string) => {
		const updatedPairs = [...parameterValuePairs];
		updatedPairs[index] = { ...updatedPairs[index], value: `${value} minutes` };
		setParameterValuePairs(updatedPairs);
	};

	const handleSubmit = () => {
		const isFormEmpty = parameterValuePairs.every(
			(pair) =>
				!pair.parameter ||
				(!pair.value &&
					pair.values.length === 0 &&
					pair.avoidValues.length === 0)
		);

		if (isFormEmpty) {
			alert("Please add at least one parameter or value before submitting.");
			return;
		}

		setIsLoading(true); // Start loading
		setTimeout(() => {
			onFormSubmit(parameterValuePairs);
			setIsLoading(false); // Stop loading
		}, 2000); // Simulate an API call delay
	};

	return (
		<TooltipProvider>
			<div className="p-4">
				<div className="font-bold text-3xl text-indigo-700 mb-4">
					Let's figure out what to cook
				</div>
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
								onSelect={(parameter) =>
									handleParameterSelect(index, parameter)
								}
								placeholder="Select Parameter"
							/>

							{pair.parameter === "Ingredient" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										Please enter the ingredients you want, separated by commas:
									</p>
									<Tooltip content="Separate each of the Ingredients by commas">
										<input
											type="text"
											className="w-42 p-2 border border-gray-300 rounded-md"
											placeholder="e.g., Bajra, Tomatoes, Garlic"
											onChange={(e) =>
												handleIngredientInputChange(index, e.target.value)
											}
										/>
									</Tooltip>
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
									<div className="flex">
										<Tooltip content="Specify the total preparation and cooking time in minutes, or use the slider.">
											<span className="text-gray-700 cursor-pointer">
												Select the desired cook time (in minutes):
											</span>
										</Tooltip>
									</div>
									<div className="flex items-center space-x-4">
										<input
											type="range"
											min={5}
											max={120}
											step={1}
											value={parseInt(pair.value) || 30}
											onChange={(e) =>
												handleCookTimeChange(index, e.target.value)
											}
											className="w-1/3"
										/>
										<input
											type="number"
											className="w-36 p-2 border border-gray-300 rounded-md"
											value={parseInt(pair.value) || 30}
											onChange={(e) =>
												handleCookTimeChange(index, e.target.value)
											}
										/>
									</div>
								</div>
							)}

							{pair.parameter === "Cuisine" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										What type of cuisine are you in the mood for? Maybe
										something exotic or comforting? Start typing to see
										suggestions or pick one below:
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{cuisineOptions.map((cuisine, idx) => (
											<button
												key={idx}
												onClick={() => handleValueSelect(index, cuisine)}
												className={`py-1 px-3 rounded-full ${
													pair.value === cuisine
														? "bg-indigo-600 text-white"
														: "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
												}`}
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
									<p className="text-md text-gray-700 mb-2">
										Select dietary preferences:
									</p>
									<ChipSelector
										options={dietOptions}
										selectedValue={pair.value}
										onSelect={(value) => handleValueSelect(index, value)}
									/>
								</div>
							)}

							{pair.parameter === "Course" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										Select the course of the meal:
									</p>
									<ChipSelector
										options={courseOptions}
										selectedValue={pair.value}
										onSelect={(value) => handleValueSelect(index, value)}
									/>
								</div>
							)}

							{pair.parameter === "Difficulty" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										Select the difficulty level:
									</p>
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
										onChange={(e) =>
											handleAvoidInputChange(index, e.target.value)
										}
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
						disabled={isLoading}
						className={`flex justify-center items-center bg-indigo-800 text-indigo-300 font-bold py-3 px-6 rounded hover:bg-indigo-600 ${
							isLoading ? "opacity-50 cursor-not-allowed" : ""
						}`}
						style={{ minWidth: "120px" }} // Ensure button width stays consistent
					>
						{isLoading ? (
							<svg
								className="animate-spin h-6 w-6 text-indigo-300"
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
						) : (
							"Search"
						)}
					</button>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default EnhancedRecipeForm;
