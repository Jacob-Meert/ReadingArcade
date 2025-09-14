import { useState } from "react";

const categories = [
  { id: "math", name: "Math", color: "math" },
  { id: "reading", name: "Reading", color: "reading" },
  { id: "science", name: "Science", color: "science" },
  { id: "fun", name: "Fun", color: "fun" },
  { id: "random", name: "Random", color: "random" },
] as const;

interface CategoryTabsProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const CategoryTabs = ({ activeCategory = "math", onCategoryChange }: CategoryTabsProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mx-auto">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const isHovered = hoveredCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ease-out
              relative overflow-hidden min-w-[100px]
              ${isActive ? 'bg-secondary text-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}
              ${isHovered ? `shadow-lg border-2 border-${category.color}` : 'border-2 border-transparent'}
            `}
            style={{
              boxShadow: isHovered ? `0 0 20px hsl(var(--${category.color}) / 0.3)` : undefined,
            }}
          >
            <span className="relative z-10">{category.name}</span>
            {isHovered && (
              <div 
                className="absolute inset-0 opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: `hsl(var(--${category.color}))` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};