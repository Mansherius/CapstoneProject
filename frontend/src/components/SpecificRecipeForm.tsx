"use client";

import React, { useState, useEffect } from "react";
import ChipSelector from "@/components/ui/chipSelector";
import { PlusIcon } from "@radix-ui/react-icons";
import { Tooltip } from "@/components/ui/toolTip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Define a type for parameter value pairs
type ParameterValuePair = {
	parameter: string;
	value: string;
	values: string[];
	avoidValues: string[];
	customInput?: string; // Added customInput for dynamic input handling
	showDropdown?: boolean;
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

const difficultyOptions = ["Easy", "Moderate", "Difficult"];

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
			customInput: "",
			showDropdown: false,
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

	type DynamicOptionCategory = {
		chips: string[];
		dropdown: string[];
	};

	type DynamicOptions = {
		cuisine: DynamicOptionCategory;
		diet: DynamicOptionCategory;
		course: DynamicOptionCategory;
	};

	const [dynamicOptions, setDynamicOptions] = useState<DynamicOptions>({
		cuisine: { chips: [], dropdown: [] },
		diet: { chips: [], dropdown: [] },
		course: { chips: [], dropdown: [] },
	});

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const response = await fetch(`/api/unique-values`);
				// const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/unique-values`);
				if (!response.ok) {
					throw new Error("Failed to fetch unique values");
				}

				const data = await response.json();

				// Helper function to process top 6 and dropdown values
				const processOptions = (values: [string, number][]) => {
					const sorted = values.sort((a, b) => b[1] - a[1]); // Sort by count
					const chips = sorted.slice(0, 6).map(([value]) => value);
					const dropdown = sorted.slice(6).map(([value]) => value);
					return { chips, dropdown };
				};

				setDynamicOptions({
					cuisine: processOptions(data.hasCuisine),
					diet: processOptions(data.hasDiet),
					course: processOptions(data.hasCourse),
				});
			} catch (error) {
				console.error("Error fetching dynamic options:", error);
			}
		};

		fetchOptions();
	}, []);

	const handleSubmit = async () => {
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

		try {
			setIsLoading(true);

			// Sync customInput to value whenever customInput is present
			const updatedPairs = parameterValuePairs.map((pair) => {
				if (pair.customInput) {
					return { ...pair, value: pair.customInput }; // Override value with customInput
				}
				return pair;
			});

			console.log("Payload sent to backend:", updatedPairs);

			await onFormSubmit(updatedPairs);
		} catch (error) {
			console.error("Error submitting the form:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TooltipProvider>
			<div className="p-4">
				<div className="font-bold text-3xl text-indigo-700 mb-4">
					Let&apos;s figure out what to cook
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
											className="w-60 p-2 border border-gray-300 rounded-md"
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
											min={1}
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
										What type of cuisine are you in the mood for?
									</p>

									{/* Render chips for top 6 */}
									<div className="flex flex-wrap gap-2 mb-4">
										{dynamicOptions.cuisine.chips
											.filter((cuisine) => cuisine !== "NA") // Exclude "NA"
											.slice(0, 6) // Take the top 6
											.map((cuisine, idx) => (
												<button
													key={idx}
													onClick={() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index ? { ...p, value: cuisine } : p
															)
														);
													}}
													className={`py-1 px-3 rounded-full ${
														pair.value === cuisine
															? "bg-indigo-600 text-white"
															: "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
													}`}
												>
													{cuisine}
												</button>
											))}

										{/* Render "Other" chip */}
										<button
											onClick={() => {
												setParameterValuePairs((prev) =>
													prev.map((p, i) =>
														i === index
															? {
																	...p,
																	value: "Other",
																	customInput: "",
																	showDropdown: true,
															  }
															: p
													)
												);
											}}
											className={`py-1 px-3 rounded-full ${
												pair.value === "Other"
													? "bg-red-600 text-white"
													: "bg-red-200 text-red-700 hover:bg-red-300"
											}`}
										>
											Other
										</button>
									</div>

									{/* Dropdown for dynamic inputs */}
									{!dynamicOptions.cuisine.chips.includes(pair.value) && (
										<div className="relative">
											<input
												type="text"
												value={pair.customInput || ""}
												placeholder="Type to search"
												onFocus={() => {
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index ? { ...p, showDropdown: true } : p
														)
													);
												}}
												onBlur={() => {
													setTimeout(() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index
																	? {
																			...p,
																			showDropdown: false,
																			value: pair.customInput || pair.value,
																	  }
																	: p
															)
														);
													}, 200); // Timeout ensures dropdown doesn't close immediately on selection
												}}
												onChange={(e) => {
													const inputValue = e.target.value;
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index
																? {
																		...p,
																		customInput: inputValue,
																		value: inputValue,
																  }
																: p
														)
													);
												}}
												className="p-2 border border-gray-300 rounded-md w-60"
											/>

											{pair.showDropdown && (
												<div className="absolute top-full left-0 w-60 mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-md z-10">
													{dynamicOptions.cuisine.dropdown
														.filter((option) =>
															option
																.toLowerCase()
																.includes(
																	(pair.customInput || "").toLowerCase()
																)
														)
														.map((option) => (
															<button
																key={option}
																onClick={() => {
																	setParameterValuePairs((prev) =>
																		prev.map((p, i) =>
																			i === index
																				? {
																						...p,
																						customInput: option,
																						value: option,
																						showDropdown: false,
																				  }
																				: p
																		)
																	);
																}}
																className="w-full text-left p-2 hover:bg-gray-100"
															>
																{option}
															</button>
														))}
												</div>
											)}
										</div>
									)}
								</div>
							)}

							{pair.parameter === "Diet" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										Select dietary preferences:
									</p>

									{/* Render chips for top 6 */}
									<div className="flex flex-wrap gap-2 mb-4">
										{dynamicOptions.diet.chips
											.filter((cuisine) => cuisine !== "NA") // Exclude "NA"
											.slice(0, 6) // Take the top 6
											.map((cuisine, idx) => (
												<button
													key={idx}
													onClick={() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index ? { ...p, value: cuisine } : p
															)
														);
													}}
													className={`py-1 px-3 rounded-full ${
														pair.value === cuisine
															? "bg-indigo-600 text-white"
															: "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
													}`}
												>
													{cuisine}
												</button>
											))}

										{/* Render "Other" chip */}
										<button
											onClick={() => {
												setParameterValuePairs((prev) =>
													prev.map((p, i) =>
														i === index
															? {
																	...p,
																	value: "Other",
																	customInput: "",
																	showDropdown: true,
															  }
															: p
													)
												);
											}}
											className={`py-1 px-3 rounded-full ${
												pair.value === "Other"
													? "bg-red-600 text-white"
													: "bg-red-200 text-red-700 hover:bg-red-300"
											}`}
										>
											Other
										</button>
									</div>

									{/* Dropdown for "Other" */}
									{/* Dropdown for dynamic inputs */}
									{!dynamicOptions.diet.chips.includes(pair.value) && (
										<div className="relative">
											<input
												type="text"
												value={pair.customInput || ""}
												placeholder="Type to search"
												onFocus={() => {
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index ? { ...p, showDropdown: true } : p
														)
													);
												}}
												onBlur={() => {
													setTimeout(() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index
																	? {
																			...p,
																			showDropdown: false,
																			value: pair.customInput || pair.value,
																	  }
																	: p
															)
														);
													}, 200); // Timeout ensures dropdown doesn't close immediately on selection
												}}
												onChange={(e) => {
													const inputValue = e.target.value;
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index
																? {
																		...p,
																		customInput: inputValue,
																		value: inputValue,
																  }
																: p
														)
													);
												}}
												className="p-2 border border-gray-300 rounded-md w-60"
											/>

											{pair.showDropdown && (
												<div className="absolute top-full left-0 w-60 mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-md z-10">
													{dynamicOptions.diet.dropdown
														.filter((option) =>
															option
																.toLowerCase()
																.includes(
																	(pair.customInput || "").toLowerCase()
																)
														)
														.map((option) => (
															<button
																key={option}
																onClick={() => {
																	setParameterValuePairs((prev) =>
																		prev.map((p, i) =>
																			i === index
																				? {
																						...p,
																						customInput: option,
																						value: option,
																						showDropdown: false,
																				  }
																				: p
																		)
																	);
																}}
																className="w-full text-left p-2 hover:bg-gray-100"
															>
																{option}
															</button>
														))}
												</div>
											)}
										</div>
									)}
								</div>
							)}

							{pair.parameter === "Course" && (
								<div className="mt-4">
									<p className="text-md text-gray-700 mb-2">
										Select the course of the meal:
									</p>

									{/* Render chips for top 6 */}
									<div className="flex flex-wrap gap-2 mb-4">
										{dynamicOptions.course.chips
											.filter((cuisine) => cuisine !== "NA") // Exclude "NA"
											.slice(0, 6) // Take the top 6
											.map((cuisine, idx) => (
												<button
													key={idx}
													onClick={() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index ? { ...p, value: cuisine } : p
															)
														);
													}}
													className={`py-1 px-3 rounded-full ${
														pair.value === cuisine
															? "bg-indigo-600 text-white"
															: "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
													}`}
												>
													{cuisine}
												</button>
											))}

										{/* Render "Other" chip */}
										<button
											onClick={() => {
												setParameterValuePairs((prev) =>
													prev.map((p, i) =>
														i === index
															? {
																	...p,
																	value: "Other",
																	customInput: "",
																	showDropdown: true,
															  }
															: p
													)
												);
											}}
											className={`py-1 px-3 rounded-full ${
												pair.value === "Other"
													? "bg-red-600 text-white"
													: "bg-red-200 text-red-700 hover:bg-red-300"
											}`}
										>
											Other
										</button>
									</div>

									{/* Dropdown for "Other" */}
									{/* Dropdown for dynamic inputs */}
									{!dynamicOptions.course.chips.includes(pair.value) && (
										<div className="relative">
											<input
												type="text"
												value={pair.customInput || ""}
												placeholder="Type to search"
												onFocus={() => {
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index ? { ...p, showDropdown: true } : p
														)
													);
												}}
												onBlur={() => {
													setTimeout(() => {
														setParameterValuePairs((prev) =>
															prev.map((p, i) =>
																i === index
																	? {
																			...p,
																			showDropdown: false,
																			value: pair.customInput || pair.value,
																	  }
																	: p
															)
														);
													}, 200); // Timeout ensures dropdown doesn't close immediately on selection
												}}
												onChange={(e) => {
													const inputValue = e.target.value;
													setParameterValuePairs((prev) =>
														prev.map((p, i) =>
															i === index
																? {
																		...p,
																		customInput: inputValue,
																		value: inputValue,
																  }
																: p
														)
													);
												}}
												className="p-2 border border-gray-300 rounded-md w-60"
											/>

											{pair.showDropdown && (
												<div className="absolute top-full left-0 w-60 mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white rounded-md shadow-md z-10">
													{dynamicOptions.course.dropdown
														.filter((option) =>
															option
																.toLowerCase()
																.includes(
																	(pair.customInput || "").toLowerCase()
																)
														)
														.map((option) => (
															<button
																key={option}
																onClick={() => {
																	setParameterValuePairs((prev) =>
																		prev.map((p, i) =>
																			i === index
																				? {
																						...p,
																						customInput: option,
																						value: option,
																						showDropdown: false,
																				  }
																				: p
																		)
																	);
																}}
																className="w-full text-left p-2 hover:bg-gray-100"
															>
																{option}
															</button>
														))}
												</div>
											)}
										</div>
									)}
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
										placeholder="e.g., Nuts, milk, Soy (not braod topics)"
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
