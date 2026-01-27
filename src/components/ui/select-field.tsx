import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "input-institutional appearance-none pr-10 cursor-pointer",
              error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
        {hint && !error && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
