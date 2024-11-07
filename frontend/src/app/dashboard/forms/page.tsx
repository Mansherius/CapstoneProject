"use client";

import React, { useState } from "react";
import ComboBox from "@/components/ui/comboBox";
import { PlusIcon } from "@radix-ui/react-icons";

// Example options for the ComboBox
const parameterOptions = ["Ingredient", "Cook Time", "Cuisine"];
const ingredientOptions = ["Apple", "Banana", "Cherry"];
const cookTimeOptions = ["15 minutes", "30 minutes", "1 hour"];

type ParameterValuePair = {
	parameter: string;
	value: string;
};

const formsQuery = () => {
	// State array to hold multiple parameter-value pairs
	const [parameterValuePairs, setParameterValuePairs] = useState<
		ParameterValuePair[]
	>([]);

	// Add a new parameter-value pair on button click
	const addParameter = () => {
		setParameterValuePairs([
			...parameterValuePairs,
			{ parameter: "", value: "" }, // Add an empty pair for new ComboBoxes
		]);
	};

	// Handle parameter selection
	const handleParameterSelect = (index: number, parameter: string) => {
		const updatedPairs = [...parameterValuePairs];
		updatedPairs[index] = { ...updatedPairs[index], parameter, value: "" };
		setParameterValuePairs(updatedPairs);
	};

	// Handle value selection
	const handleValueSelect = (index: number, value: string) => {
		const updatedPairs = [...parameterValuePairs];
		updatedPairs[index] = { ...updatedPairs[index], value };
		setParameterValuePairs(updatedPairs);
	};

	// Define options based on selected parameter
	const getOptions = (parameter: string) => {
		switch (parameter) {
			case "Ingredient":
				return ingredientOptions;
			case "Cook Time":
				return cookTimeOptions;
			default:
				return [];
		}
	};

	return (
		<div>
			<div className="font-bold text-4xl flex justify-center items-center py-2 text-indigo-700">
				Knowledge Graph Form Querying
			</div>
			<main className="flex gap-8 p-4">
				<div>
					<p className="text-lg">
						Please select one or more parameters for the search{" "}
					</p>

					{/* Render a ComboBox for each parameter-value pair with numbered label */}
					{parameterValuePairs.map((pair, index) => (
						<div key={index} className="flex items-center space-x-2 p-2">
							{/* Label with numbered item */}
							<span className="font-semibold text-indigo-700">
								{index + 1}.
							</span>

							<div className="flex space-x-2">
								{/* Parameter ComboBox */}
								<ComboBox
									options={parameterOptions}
									value={pair.parameter}
									onSelect={(parameter) =>
										handleParameterSelect(index, parameter)
									}
									placeholder="Select Parameter"
								/>

								{/* Value ComboBox, shows options based on selected parameter */}
								{pair.parameter && (
									<ComboBox
										options={getOptions(pair.parameter)}
										value={pair.value}
										onSelect={(value) => handleValueSelect(index, value)}
										placeholder={`Select ${pair.parameter}`}
									/>
								)}
							</div>
						</div>
					))}

					{/* Button to add new parameter */}
					<div className="flex items-center space-x-2 mt-2">
						<button
							onClick={addParameter}
							className="flex items-center space-x-1 text-indigo-700 hover:text-indigo-500"
						>
							<PlusIcon /> <span>Add a new parameter</span>
						</button>
					</div>

					{/* Submit button */}
					<div className="pt-6 flex justify-end">
						<button
							onClick={() =>
								console.log("Submitted values:", parameterValuePairs)
							}
							className="bg-indigo-800 text-indigo-300 font-bold py-3 px-6 rounded hover:bg-indigo-600"
						>
							Submit
						</button>
					</div>
				</div>

				{/* Second Div where the results will be loaded */}
				<div>Hello there</div>
			</main>
		</div>
	);
};

export default formsQuery;
