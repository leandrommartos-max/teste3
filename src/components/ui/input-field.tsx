import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, label, error, hint, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPassword = type === "password";

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "input-institutional",
              isPassword && "pr-12",
              error && "border-destructive focus:ring-destructive/30 focus:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
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
InputField.displayName = "InputField";

export { InputField };
