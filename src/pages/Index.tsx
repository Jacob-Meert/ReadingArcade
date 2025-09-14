import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs"; 
import { GameGrid } from "@/components/GameGrid";
import mathGameIcon from "@/assets/math-game-icon.jpg";
import readingGameIcon from "@/assets/reading-game-icon.jpg";
import scienceGameIcon from "@/assets/science-game-icon.jpg";
import funGameIcon from "@/assets/fun-game-icon.jpg";
import randomGameIcon from "@/assets/random-game-icon.jpg";

// Mock game data - you can replace this with your actual game data
const mockGames = [
  {
    id: "1",
    title: "Number Ninja",
    description: "Master arithmetic operations while fighting mathematical monsters in this action-packed adventure.",
    image: mathGameIcon,
    rating: 4.8,
    category: "math" as const,
  },
  {
    id: "2", 
    title: "Word Quest",
    description: "Embark on a literary journey, building vocabulary and reading comprehension through epic storytelling.",
    image: readingGameIcon,
    rating: 4.6,
    category: "reading" as const,
  },
  {
    id: "3",
    title: "Lab Explorer", 
    description: "Conduct virtual experiments and discover the wonders of chemistry, physics, and biology.",
    image: scienceGameIcon,
    rating: 4.7,
    category: "science" as const,
  },
  {
    id: "4",
    title: "Puzzle Paradise",
    description: "Solve creative puzzles and brain teasers that will challenge your problem-solving skills.",
    image: funGameIcon,
    rating: 4.9,
    category: "fun" as const,
  },
  {
    id: "5",
    title: "Surprise Challenge",
    description: "Never know what's coming next! Random educational challenges that keep learning exciting.",
    image: randomGameIcon,
    rating: 4.5,
    category: "random" as const,
  },
  {
    id: "6",
    title: "Fraction Fighter",
    description: "Battle through dungeons while learning fractions, decimals, and percentages.",
    image: mathGameIcon,
    rating: 4.4,
    category: "math" as const,
  },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("math");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter games based on active category and search query
  const filteredGames = mockGames.filter((game) => {
    const matchesCategory = game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGamePlay = (gameId: string) => {
    console.log("Playing game:", gameId);
    // Add your game launch logic here
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-col items-center space-y-3">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <section className="py-4 border-b border-border">
        <div className="container mx-auto px-6">
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          <GameGrid 
            games={filteredGames}
            onGamePlay={handleGamePlay}
          />
        </div>
      </section>
    </main>
  );
};

export default Index;
