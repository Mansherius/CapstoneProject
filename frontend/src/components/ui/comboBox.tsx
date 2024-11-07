"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the types for options and ComboBox props
type Option = string;

interface ComboBoxProps {
  options: Option[];                 // Array of options for the ComboBox
  value: Option;                     // The currently selected value
  onSelect: (option: Option) => void; // Callback function for selection
  placeholder?: string;              // Placeholder for the input
}

const ComboBox: React.FC<ComboBoxProps> = ({ options, value, onSelect, placeholder = "Select an option" }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");

  // Filtered options based on the search input
  const filteredOptions: Option[] = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: Option): void => {
    onSelect(option);  // Call the provided onSelect callback
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-between w-52 p-2 border rounded-md bg-white"
          onClick={() => setOpen(!open)}
          id="combobox-trigger"
        >
          {value || placeholder}
          <CaretSortIcon className="ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 bg-indigo-400">
        <input
          type="text"
          id="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search"
          className="w-full p-2 mb-2 border rounded-md"
        />
        <ul className="max-h-40 overflow-y-auto" id="options-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                id={`option-${option.toLowerCase()}`}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex items-center text-white font-semibold p-2 cursor-pointer hover:bg-indigo-500",
                  value === option && "bg-indigo-600 font-semibold"
                )}
              >
                {value === option && <CheckIcon className="mr-2" />}
                {option}
              </li>
            ))
          ) : (
            <li id="no-options" className="p-2 text-black">No options found</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
