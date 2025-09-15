import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";


const StackFireBall = () => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
    <div>
        {/* Header Section */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-6 py-3">
                <div className="flex flex-col items-center space-y-3">
                    <SearchBar onSearch={setSearchQuery} />
                </div>
            </div>
        </header>
    </div>
    );
};

  export default StackFireBall;