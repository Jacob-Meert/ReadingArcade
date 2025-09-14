import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ placeholder = "Search games...", onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-12 h-14 text-lg bg-card border-border rounded-xl 
                   focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-300 ease-out"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};