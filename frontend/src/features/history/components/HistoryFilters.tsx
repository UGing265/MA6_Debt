"use client";

import React from "react";
import { Search } from "lucide-react";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";
import { useWallets } from "../../wallet/hooks/useWallets";

export const HistoryFilters: React.FC = () => {
  const { inputValue, currentWalletId, setSearch, setWalletId } = useHistoryQueryState();
  const { data: wallets } = useWallets();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter out grandchild wallets - only show root wallets and direct children
  const allWallets = React.useMemo(() => {
    const list = wallets ?? [];
    const rootIds = new Set(list.filter(w => !w.parentWalletId).map(w => w.id));
    // Include: root wallets OR direct children of root wallets
    return list.filter(w => !w.parentWalletId || rootIds.has(w.parentWalletId));
  }, [wallets]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
        <input
          type="text"
          placeholder="Search by note, partner, wallet..."
          value={inputValue ?? ""}
          onChange={onSearchChange}
          aria-label="Search history"
          className="w-full pl-11 pr-4 py-3 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
        />
      </div>

      {/* Wallet Filter Dropdown */}
      <select
        value={currentWalletId ?? ""}
        onChange={(e) => setWalletId(e.target.value)}
        className="px-4 py-3 text-sm border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer min-w-[200px]"
        aria-label="Filter by wallet"
      >
        <option value="">All Wallets</option>
        {allWallets.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HistoryFilters;
