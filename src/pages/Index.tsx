// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GameGrid } from "@/components/GameGrid";
import { useNavigate } from "react-router-dom";

/** Full Game used by the grid */
interface Game {
  id: string;
  title: string;
  description: string;
  category: "math" | "reading" | "science" | "fun" | "random";
  image: string;
  rating: number;
  url: string;
}

const Index = () => {
  // Data
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Routing query param for cross-page submit
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = (searchParams.get("search") || "").trim();

  // Tabs + search
  const [activeCategory, setActiveCategory] = useState("all");
  const [inputValue, setInputValue] = useState(initialQuery);   // what the user sees in the box
  const [searchQuery, setSearchQuery] = useState(initialQuery); // the submitted query that filters

  const jsonUrl = `${import.meta.env.BASE_URL}games.json`;
  
  const navigate = useNavigate();
  
  
  // Fetch games.json for the grid
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = import.meta.env.DEV ? `${jsonUrl}?t=${Date.now()}` : jsonUrl;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to load games.json (${res.status}) — ${txt.slice(0, 100)}`);
        }
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(`Expected JSON, got '${ct}'. Body: ${txt.slice(0, 120)}`);
        }
        const data: Game[] = await res.json();
        if (!cancelled) setGames(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [jsonUrl]);

  // If URL ?search= changes (e.g., coming from /test), sync it into input + filter + tab
  useEffect(() => {
    const q = (searchParams.get("search") || "").trim();
    setInputValue(q);
    setSearchQuery(q);
    if (q) setActiveCategory("all");
  }, [searchParams]);

  // Enter from SearchBar (on this page or other pages):
  // - Switch to All
  // - Apply filter
  // - Keep URL in sync so refresh keeps the results
  const handleSearchSubmit = (value: string) => {
    const q = value.trim();
    setSearchQuery(q);
    setActiveCategory("all");
    setSearchParams(q ? { search: q } : {});
  };

  const handlePick = (item) => {
    navigate(item.url);
  };


  // Tab change: clear both search states and remove ?search= from URL
  const handleCategoryChange = (id: string) => {
    if (id === "random") {
      const randomGame = games[Math.floor(Math.random() * games.length)];
      handlePick(randomGame);
      return;
    }

    setActiveCategory(id);
    setSearchQuery("");
    setInputValue("");
    setSearchParams({});
  };

  // Filtering: if query present → global startsWith on title/description; else by category
  const filteredGames = games.filter((g) => {
    const q = searchQuery.trim().toLowerCase();
    const hasQuery = q !== "";
    if (hasQuery) {
      return (
        g.title.toLowerCase().startsWith(q) ||
        g.description.toLowerCase().startsWith(q)
      );
    }
    return activeCategory === "all" ? true : g.category === activeCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header with SearchBar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex justify-center space-x-4">
            <img
              src="/favicon.ico"
              alt="ReadingArcade"
              className="h-10 w-10"
            />
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSearchSubmit} // SearchBar also navigates('/?search=...'); we sync state/URL here
              onPick={handlePick}
              placeholder="Search games…"
              minChars={1}
              maxVisible={8}
            />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <section className="py-4 border-b border-border">
        <div className="container mx-auto px-6">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Instructional Area */}
      <div className="container mx-auto px-6 py-3">
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Tip: Press 'Caps Lock' to hide the screen (works only when clicked out of game)
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          {loading && <div>Loading games…</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {!loading && !error && (
            <>
              <GameGrid
                games={filteredGames}
                onGamePlay={handlePick} 
              />
              {filteredGames.length === 0 && (
                <div className="mt-6 text-sm text-muted-foreground">
                  No games found. Try a different search or category.
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;