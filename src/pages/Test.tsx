// src/pages/TestPage.tsx
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";

const TestPage = () => {
  // Local state for the controlled SearchBar
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-xl px-6">
        <h1 className="text-xl font-bold mb-4">Test Page</h1>
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          onSubmit={(val) => {
            console.log("Submitted from TestPage:", val);
          }}
          onPick={(item) => {
            console.log("Picked suggestion:", item);
          }}
          placeholder="Search games…"
        />
      </div>
    </main>
  );
};

export default TestPage;