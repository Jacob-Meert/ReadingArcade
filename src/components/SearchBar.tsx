import React from "react";

interface SearchBarProps {
  value: string;                      // controlled input value from parent
  onChange: (value: string) => void;  // update parent-held input state (no filtering)
  onSubmit?: (value: string) => void; // run when user presses Enter / submits
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}  // just update text, no filtering yet
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-4 py-2"
        aria-label="Search games"
      />
    </form>
  );
};
