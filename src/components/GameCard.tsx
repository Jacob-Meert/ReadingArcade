import { Play, Star } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  rating?: number;
  category: "math" | "reading" | "science" | "fun" | "random";
  onPlay?: () => void;
}

export const GameCard = ({ title, description, image, rating = 4.5, category, onPlay }: GameCardProps) => {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border 
                    hover:border-primary/50 transition-all duration-300 ease-out
                    hover:shadow-2xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 
                     group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <button
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 
                     group-hover:opacity-100 transition-all duration-300"
        >
          <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 
                          hover:bg-primary transition-colors duration-200">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary 
                         transition-colors duration-200 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {description}
        </p>

        {/* Category Badge */}
        <div 
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium 
                      bg-${category}/20 text-${category} border border-${category}/30`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
      </div>
    </div>
  );
};