import { GameCard } from "./GameCard";

interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  category: "math" | "reading" | "science" | "fun" | "random";
  url: string;
}

interface GameGridProps {
  games: Game[];
  onGamePlay?: (game: Game) => void;
}

export const GameGrid = ({ games, onGamePlay }: GameGridProps) => {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No games found</h3>
        <p className="text-muted-foreground">Try selecting a different category or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 
                    w-full max-w-7xl mx-auto">
      {games.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          image={game.image}
          rating={game.rating}
          category={game.category}
          onPlay={() => onGamePlay?.(game)}
        />
      ))}
    </div>
  );
};