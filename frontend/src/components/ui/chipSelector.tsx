import React from "react";

type ChipSelectorProps = {
	options: string[];
	selectedValue: string;
	onSelect: (value: string) => void;
	placeholder?: string;
};

const ChipSelector: React.FC<ChipSelectorProps> = ({
	options,
	selectedValue,
	onSelect,
	placeholder,
}) => {
	return (
		<div className="chip-selector">
			<div className="flex flex-wrap gap-2">
				{options.map((option, index) => (
					<button
						key={index}
						className={`chip ${
							selectedValue === option
								? "bg-indigo-700 text-white"
								: "bg-indigo-200 text-indigo-700"
						} 
                      py-1 px-3 rounded-full transition duration-300 ease-in-out hover:bg-indigo-500 hover:scale-105`}
						onClick={() => onSelect(option)}
					>
						{option}
					</button>
				))}
			</div>
			{selectedValue === "" && placeholder && (
				<p className="text-sm text-gray-500">{placeholder}</p>
			)}
		</div>
	);
};

export default ChipSelector;
