import React from "react";
import { Search } from "lucide-react";

type SortOption = "name-asc" | "name-desc" | "balance-high" | "balance-low";

interface WalletSearchSortProps {
  searchQuery: string;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export const WalletSearchSort: React.FC<WalletSearchSortProps> = ({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
        <input
          type="text"
          placeholder="Search wallet by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search wallets by name"
          className="w-full pl-11 pr-4 py-3 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-4 py-2.5 text-sm border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer min-w-[180px]"
        aria-label="Sort wallets"
      >
        <option value="name-asc">Name A → Z</option>
        <option value="name-desc">Name Z → A</option>
        <option value="balance-high">Balance: High to Low</option>
        <option value="balance-low">Balance: Low to High</option>
      </select>
    </div>
  );
};
