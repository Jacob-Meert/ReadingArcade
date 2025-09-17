
// src/pages/GameEmbedTemplate.tsx
import { useLayoutEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Link } from "react-router-dom";

/**
 * EMBED_URL:
 * - Point this to your HTML game (local in /public or an external URL).
 *   - Local (served from your app): "/games/space-invaders/index.html"
 *   - External (another domain): "https://example.com/game/index.html"
 *
 * IMPORTANT (external games):
 * - Some providers block embedding with response headers like:
 *   - X-Frame-Options: SAMEORIGIN
 *   - Content-Security-Policy: frame-ancestors 'none' ...
 *   If the game won’t show inside the iframe, the server is likely blocking embeds.
 *   In that case, host the game yourself or ask the provider to allow your domain.
 */
const EMBED_URL = "https://cloud.onlinegames.io/games/2024/unity2/super-car-driving/index-og.html";

export default function GameEmbedTemplate() {
  // Same simple logic as your Test page: local state for a controlled SearchBar; no routing here.
  const [inputValue, setInputValue] = useState("");

  // We measure the header height so we can size the game area to fill the remaining viewport.
  // Result is stored in a CSS var (--header-h) so it can be used in inline styles or CSS.
  const headerRef = useRef<HTMLElement | null>(null);

  // Measure header height -> set CSS var so the iframe fits the viewport with no page scrolling
  useLayoutEffect(() => {
    const setHeaderVar = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setHeaderVar();
    window.addEventListener("resize", setHeaderVar);
    window.addEventListener("orientationchange", setHeaderVar);
    return () => {
      window.removeEventListener("resize", setHeaderVar);
      window.removeEventListener("orientationchange", setHeaderVar);
    };
  }, []);

  /**
   * calcEmbedHeight:
   * - Tiny typed helper function (TSX) to compute the height string for the game container.
   * - Uses 100svh (small viewport height) so the number reflects the *usable* viewport on mobile,
   *   avoiding the classic 100vh overflow when mobile browser chrome (URL bar) is visible.
   * - Subtracts the actual header height (via CSS var) and a small gap (in rem).
   */
  const calcEmbedHeight = (gapRem: number = 0.75): string =>
    `calc(100svh - var(--header-h, 64px) - ${gapRem}rem)`;

  

  return (
    <main className="min-h-screen bg-background">
      {/* ===== Header (favicon on the left, centered search bar) =====
         - Matches the style you liked earlier: sticky, blurred, border bottom.
         - The SearchBar stays controlled locally and only logs submit/pick events.
      */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-4">
            {/* Your favicon as the header image */}
            <Link to="/" aria-label="ReadingArcade home">
              <img
                src="/favicon.ico"
                alt="ReadingArcade"
                className="h-10 w-10 select-none"
                draggable={false}
              />
            </Link>

            {/* Centered SearchBar; width constrained for tidy layout */}
            <div className="w-full max-w-xl">
              <SearchBar
                value={inputValue}
                onChange={setInputValue}
                onSubmit={(val) => {
                  // Keep the simple TestPage behavior: just log.
                  console.log("Submitted from GameEmbedTemplate:", val);
                }}
                onPick={(item) => {
                  // Keep the simple TestPage behavior: just log.
                  console.log("Picked suggestion:", item);
                }}
                placeholder="Search games…"
                minChars={1}
                maxVisible={8}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ===== Game area with side "ad rails" =====
         Layout goals:
         - On xl+ screens, reserve left/right rails (280px each) for future ads (currently empty).
         - On smaller screens, rails collapse (no wasted space).
         - The center column holds the iframe and is sized to fill the viewport height.
         - Result: no page scroll to see the bottom of the game; the iframe fills the screen
           beneath the header.
      */}
      <section className="py-3">
        {/* Outer container controls max width and side padding (good place for future page gutters) */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          {/* 1 col on small screens; 3 cols (left-rail, center, right-rail) on xl+ */}
          <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_280px] gap-4">
            {/* Left ad rail (placeholder). Visible only on xl+. */}
            <aside className="hidden xl:block" aria-hidden="true">
              {/* Future Ad Slot: e.g., <AdSlot id="left-rail" /> */}
            </aside>

            {/* Center: the game frame (fills the remaining viewport height) */}
            <div
              className="relative w-full rounded-lg border overflow-hidden"
              style={{ height: calcEmbedHeight(0.75) }}
            >
              <iframe
                title="Embedded Game"
                src={EMBED_URL} // <-- Set this per game (local /public path or external URL)
                className="absolute inset-0 w-full h-full"
                /**
                 * Sandbox notes (external games):
                 * - Start WITHOUT sandbox. Many games need same-origin or features blocked by sandbox.
                 * - If you do add sandbox, include only the tokens you need:
                 *   e.g., sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                 * - Keep allowFullScreen + allow list for common APIs: fullscreen/gamepad/autoplay/clipboard.
                 */
                // sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                allow="fullscreen *; gamepad *; autoplay; clipboard-read; clipboard-write"
                allowFullScreen
                loading="eager"
              />
            </div>

            {/* Right ad rail (placeholder). Visible only on xl+. */}
            <aside className="hidden xl:block" aria-hidden="true">
              {/* Future Ad Slot: e.g., <AdSlot id="right-rail" /> */}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== Why this works =====
   - Padding won't prevent vertical overflow. Instead, we size the center game container
     to fill the viewport height minus the *actual* header height.
   - We use 100svh (small viewport height) to behave correctly on mobile when browser chrome shows/hides.
   - Measuring header height at runtime ensures accuracy even if the header’s content changes.

   ===== Reuse per game =====
   - Replace EMBED_URL for each game, or duplicate this file per game.
   - If you prefer aspect-ratio boxing (like fixed 16:9) instead of full-height:
       1) Remove the inline height style using calcEmbedHeight(...).
       2) Use a padding-top trick:
          <div style={{ paddingTop: "56.25%" }} className="relative ...">
            <iframe className="absolute inset-0 w-full h-full" ... />
          </div>

   ===== Optional inline alternative (no external URL) =====
   - If you want the game’s HTML to live *inside this same .tsx file*:
       1) Define: const GAME_HTML = `<!doctype html> ... full HTML ... `;
       2) Replace src={EMBED_URL} with: srcDoc={GAME_HTML}
       3) Remove allowFullScreen if not needed (keeps it simple).

   ===== Ads / rails =====
   - Rails are 280px each on xl+ by default. Adjust widths/breakpoints to your needs:
       xl:grid-cols-[300px_minmax(0,1fr)_300px]
   - On smaller screens, they're hidden to keep the focus on the game.

   ===== TSX helper function pattern =====
   - calcEmbedHeight shows a typed function inside a component.
   - If a helper doesn’t rely on state/props, you can also move it outside the component or export it from a utility module.
*/

