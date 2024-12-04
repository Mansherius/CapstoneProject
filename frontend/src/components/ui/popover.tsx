"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/utils/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", side = "bottom", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-64 w-72 overflow-y-auto rounded-md border bg-white p-2 text-black shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const AutocompletePopover: React.FC<{
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
}> = ({ options, onSelect, placeholder }) => {
  const [inputValue, setInputValue] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>(options);
  const [isOpen, setIsOpen] = React.useState(false); // Control dropdown visibility

  React.useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={inputValue}
          onFocus={() => setIsOpen(true)} // Open dropdown on focus
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-md w-60"
        />
      </PopoverTrigger>
      {isOpen && filteredOptions.length > 0 && ( // Only render dropdown if options exist
        <PopoverContent>
          <div className="flex flex-col space-y-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setInputValue(option);
                  setIsOpen(false); // Close dropdown on selection
                }}
                className="text-left p-2 hover:bg-gray-100 rounded-md"
              >
                {option}
              </button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, AutocompletePopover };
