"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type SortOption = "name-asc" | "name-desc" | "balance-high" | "balance-low";

interface WalletSearchSortProps {
  searchQuery: string;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "balance-high", label: "Balance: High to Low" },
  { value: "balance-low", label: "Balance: Low to High" },
];

export const WalletSearchSort: React.FC<WalletSearchSortProps> = ({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const localizedSortOptions = SORT_OPTIONS.map((option) => ({
    ...option,
    label:
      option.value === "name-asc"
        ? t.wallets.page.search.options.nameAsc
        : option.value === "name-desc"
          ? t.wallets.page.search.options.nameDesc
          : option.value === "balance-high"
            ? t.wallets.page.search.options.balanceHigh
            : t.wallets.page.search.options.balanceLow,
  }));
  const selectedLabel = localizedSortOptions.find((o) => o.value === sortBy)?.label ?? t.wallets.page.search.sortLabel;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pencil-gray" />
        <input
          type="text"
          placeholder={t.wallets.page.search.placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t.wallets.page.search.aria}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 hover:border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 text-ink-black font-medium placeholder:text-pencil-gray/70 shadow-xs transition-all"
        />
      </div>

      {/* Custom Sort Popover Dropdown */}
      <div className="relative min-w-[190px]" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-2.5 text-sm rounded-xl bg-white text-ink-black flex items-center justify-between shadow-xs transition-all cursor-pointer outline-none",
            isOpen
              ? "border-2 border-note-yellow font-semibold"
              : "border border-gray-200 hover:border-gray-300 font-medium"
          )}
        >
          <span>{selectedLabel}</span>
          <ChevronDown className={cn("h-4 w-4 text-pencil-gray transition-transform duration-200 ml-2 shrink-0", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 z-50 w-full rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl space-y-1 animate-in fade-in-50 zoom-in-95">
            {localizedSortOptions.map((opt) => {
              const isSelected = opt.value === sortBy;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onSortChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                    isSelected ? "bg-note-yellow font-bold text-ink-black shadow-xs" : "text-ink-black hover:bg-amber-100/50 font-medium"
                  )}
                >
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
