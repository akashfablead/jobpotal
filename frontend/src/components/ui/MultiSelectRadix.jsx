// components/MultiSelectRadix.jsx
import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Optional: for conditional className utility

const MultiSelectRadix = ({ label, name, options, values, onChange }) => {
  const toggleOption = (option) => {
    const newValues = values.includes(option)
      ? values.filter((v) => v !== option)
      : [...values, option];
    onChange(name, newValues);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            id={name}
            className="col-span-3 p-2 border rounded w-full text-left"
          >
            {values.length ? values.join(", ") : "Select..."}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-[250px] bg-white border rounded shadow p-2"
            align="start"
          >
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer py-1"
              >
                <Checkbox.Root
                  className="w-4 h-4 border rounded data-[state=checked]:bg-blue-500"
                  checked={values.includes(option)}
                  onCheckedChange={() => toggleOption(option)}
                >
                  <Checkbox.Indicator className="text-white">
                    <Check className="w-3 h-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default MultiSelectRadix;
