import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputWithSuggestionsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[];
}

const InputWithSuggestions = React.forwardRef<
  HTMLInputElement,
  InputWithSuggestionsProps
>(
  (
    { className, suggestions = [], onFocus, onBlur, onChange, value, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<
      string[]
    >([]);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const suggestionsRef = React.useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value
    React.useEffect(() => {
      if (!value?.toString().trim()) {
        setFilteredSuggestions(suggestions);
      } else {
        const filtered = suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(value?.toString().toLowerCase())
        );
        setFilteredSuggestions(filtered);
      }
    }, [value, suggestions]);

    // Handle click outside to close suggestions
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          (containerRef.current &&
            !containerRef.current.contains(event.target as Node)) ||
          (suggestionsRef.current &&
            !suggestionsRef.current.contains(event.target as Node))
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay blur to allow suggestion clicks
      setTimeout(() => setIsFocused(false), 200);
      onBlur?.(e);
    };

    const handleSuggestionClick = (suggestion: string) => {
      setIsFocused(false);

      // Create a synthetic event to trigger onChange
      const syntheticEvent = {
        target: { value: suggestion },
        currentTarget: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setIsFocused(false);
      }
      props.onKeyDown?.(e);
    };

    return (
      <div ref={containerRef} className="relative">
        <Input
          className={cn("w-full", className)}
          ref={ref}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {isFocused && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            data-state="open"
            className="absolute top-full w-full left-0 right-0 z-50 mt-2 p-2 max-h-64 overflow-y-auto bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden rounded-md border shadow-md"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm rounded-md font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

InputWithSuggestions.displayName = "InputWithSuggestions";

export { InputWithSuggestions };
