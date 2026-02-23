"use client";

import React from "react";
import { Search, Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {/* Search Input - matches /wallet style */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
        <input
          type="text"
          placeholder="Search by note, partner..."
          value={inputValue ?? ""}
          onChange={onSearchChange}
          aria-label="Search history"
          className="w-full pl-11 pr-4 py-3 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
        />
      </div>

      {/* Wallet Filter Buttons - matches /wallet sort button style */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={!currentWalletId ? "default" : "outline"}
          className={!currentWalletId ? "bg-note-yellow text-ink-black hover:bg-note-yellow/90" : "border-note-yellow"}
          onClick={() => setWalletId("")}
          size="sm"
        >
          <Wallet2 className="h-4 w-4 mr-1" />
          All Wallets
        </Button>
        {allWallets.slice(0, 2).map((w) => (
          <Button
            key={w.id}
            variant={currentWalletId === w.id ? "default" : "outline"}
            className={currentWalletId === w.id ? "bg-note-yellow text-ink-black hover:bg-note-yellow/90" : "border-note-yellow"}
            onClick={() => setWalletId(w.id)}
            size="sm"
          >
            {w.name}
          </Button>
        ))}
        {allWallets.length > 2 && (
          <select
            value={currentWalletId ?? ""}
            onChange={(e) => setWalletId(e.target.value)}
            className="px-3 py-1.5 text-sm border-2 border-note-yellow rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer"
            aria-label="More wallets"
          >
            <option value="">More...</option>
            {allWallets.slice(2).map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default HistoryFilters;
