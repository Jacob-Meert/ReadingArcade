// src/components/SearchBar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Lightweight suggestion item, local to SearchBar */
type MiniGame = {
  id?: string;
  title: string;
  image: string;
  url: string;
};

interface SearchBarProps {
  value: string;                        // controlled input text
  onChange: (value: string) => void;    // update controlled text while typing
  onSubmit?: (value: string) => void;   // optional callback after we navigate/submit
  onPick?: (item: MiniGame) => void;    // optional (mouse-pick a suggestion) — OK to omit
  placeholder?: string;
  minChars?: number;
  maxVisible?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onPick,
  placeholder = "Search…",
  minChars = 1,
  maxVisible = 8,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);           // suggestions popup visible?
  const [allMini, setAllMini] = useState<MiniGame[]>([]); // cached suggestions list
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Build base-aware path so this works under subpaths in prod
  const jsonUrl = `${import.meta.env.BASE_URL}games.json`;

  // Fetch games.json once and map to MiniGame[] for suggestions
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cacheBusted = import.meta.env.DEV ? `${jsonUrl}?t=${Date.now()}` : jsonUrl;
        const res = await fetch(cacheBusted, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load games.json (${res.status})`);
        const data = await res.json();
        const mini: MiniGame[] = (data ?? []).map((g: any) => ({
          id: g?.id,
          title: String(g?.title ?? ""),
          image: String(g?.image ?? ""),
          url: String(g?.url ?? ""),
        }));
        if (!cancelled) setAllMini(mini);
      } catch (e) {
        console.error("SearchBar suggestions: failed to load games.json:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [jsonUrl]);

  // Filter suggestions by "startsWith" on title (case-insensitive)
  const filtered: MiniGame[] = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < minChars) return [];
    return allMini
      .filter(m => (m.title ?? "").toLowerCase().startsWith(q))
      .slice(0, maxVisible);
  }, [value, allMini, minChars, maxVisible]);

  // Open suggestions when we have results and input is focused
  useEffect(() => {
    const focused = document.activeElement === inputRef.current;
    setOpen(filtered.length > 0 && focused);
  }, [filtered.length]);

  // Close popup when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Submit: hide popup, navigate to Index with ?search=, then call parent handler
  const handleSubmit = () => {
    const q = value.trim();
    setOpen(false);
    navigate(`/?search=${encodeURIComponent(q)}`);  // pass query via URL
    onSubmit?.(q); // optional: parent can react too
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            const q = e.target.value.trim();
            setOpen(q.length >= minChars && filtered.length > 0);
          }}
          onFocus={() => setOpen(filtered.length > 0)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-background px-4 py-2"
          aria-label="Search games"
          autoComplete="off"
        />
      </form>

      {/* Mouse-only suggestions popup */}
      {open && filtered.length > 0 && (
        <div
          className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg"
          role="listbox"
        >
          {filtered.map((item) => (
            <button
              key={item.id ?? item.url}
              type="button"
              onClick={() => {
                setOpen(false);
                onPick?.(item); // currently you won't pass this; fine to no-op
              }}
              className="flex w-full items-center gap-3 p-2 text-left hover:bg-accent"
              role="option"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-8 w-8 rounded object-cover"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground truncate">{item.url}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
