import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/utils/utils"

// Define the types for the props
interface ComboBoxProps {
  placeholder?: string
  options: string[]
  previousSelections?: string[]
  onSelectionChange: (selectedOption: string) => void
}

export default function ComboBox({
  placeholder = "Select a feature",
  options = [],
  previousSelections = [],
  onSelectionChange,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [filteredOptions, setFilteredOptions] = React.useState(options)

  // Filter options based on current input value and previous selections
  React.useEffect(() => {
    let filtered = options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    )

    // Apply additional filtering based on previousSelections if provided
    if (previousSelections.length > 0) {
      filtered = filtered.filter((option) =>
        previousSelections.every(prev => option.includes(prev))
      )
    }

    setFilteredOptions(filtered)
  }, [value, previousSelections, options])

  // Handle selection
  const handleSelect = (selectedOption: string) => {
    setValue(selectedOption)
    setOpen(false)
    onSelectionChange(selectedOption)   // Notify parent of selection
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-between w-full p-2 border rounded-md"
        >
          {value || placeholder}
          <CaretSortIcon className="ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <input
          type="text"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-2 py-1 mb-2 border rounded-md"
        />
        <div className="max-h-40 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => handleSelect(option)}
            >
              {option}
              {value === option && <CheckIcon className="ml-2" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
