import React, { useState } from "react";
import { Search } from "lucide-react";

interface GoogleSearchProps {
  isVisible: boolean;
}

const GoogleSearch: React.FC<GoogleSearchProps> = ({ isVisible }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
        "_blank"
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Google search"
          className="w-full py-2 pl-4 pr-10 rounded-full bg-black/50 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default GoogleSearch;
