import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { GameGrid } from "@/components/GameGrid";

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
  // Data loading
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs + search state
  const [activeCategory, setActiveCategory] = useState("all");

  // Separate "what's typed" from "what's submitted"
  const [inputValue, setInputValue] = useState(""); // typing only
  const [searchQuery, setSearchQuery] = useState(""); // submitted query

  const jsonUrl = `${import.meta.env.BASE_URL}games.JSON`;

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
          throw new Error(`Failed to load games.json (${res.status}). Body: ${txt.slice(0, 120)}`);
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

    return () => {
      cancelled = true;
    };
  }, [jsonUrl]);

  // When user presses Enter in the SearchBar
  const handleSearchSubmit = (value: string) => {
    setSearchQuery(value);   // now filtering uses this
    setActiveCategory("all"); // jump to All to show global matches
  };

  // When user clicks a tab: clear the search and input so tab filtering takes over
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");  // stop global filtering
    setInputValue("");   // also clear the input box visually
  };

  // Filtering:
  // - If there's a submitted query, ignore tabs (global search)
  // - If no query, respect the active tab
  const filteredGames = games.filter((g) => {
    const q = searchQuery.trim().toLowerCase();
    const hasQuery = q !== "";

    if (hasQuery) {
      return (
        g.title.toLowerCase().startsWith(q)
      );
    }

    return activeCategory === "all" ? true : g.category === activeCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-col items-center space-y-3">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}           // typing only
              onSubmit={handleSearchSubmit}      // Enter submits & switches to All
            />
            {/* Optional debug: */}
            {/* <div className="text-xs opacity-60">active: {activeCategory}, query: "{searchQuery}"</div> */}
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <section className="py-4 border-b border-border">
        <div className="container mx-auto px-6">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange} // clears search on tab change
          />
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          {loading && <div>Loading games…</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {!loading && !error && (
            <>
              <GameGrid games={filteredGames} onGamePlay={(id) => console.log("Play:", id)} />
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


