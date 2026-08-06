"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ChevronDown } from "lucide-react";
import { HistoryDto } from "../types/history";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryRow } from "./HistoryRow";
import { useHistoryQueryState, PAGE_SIZE_OPTIONS } from "../hooks/useHistoryQueryState";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type HistoryListProps = {
  items?: HistoryDto[];
  isLoading: boolean;
  error?: any;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
  sortOrder: "newest" | "oldest";
  onSortChange: (order: "newest" | "oldest") => void;
};

const PageSizeDropdown: React.FC<{
  currentPageSize: number;
  onSelect: (size: number) => void;
}> = ({ currentPageSize, onSelect }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl bg-white text-ink-black shadow-xs transition-all cursor-pointer outline-none",
          isOpen
            ? "border-2 border-note-yellow font-bold"
            : "border border-gray-200 hover:border-gray-300 font-semibold"
        )}
      >
        <span>{currentPageSize} / {t.common.page}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-pencil-gray transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[110px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl space-y-0.5 animate-in fade-in-50 zoom-in-95">
          {PAGE_SIZE_OPTIONS.map((size) => {
            const isSelected = size === currentPageSize;
            return (
              <div
                key={size}
                onClick={() => {
                  onSelect(size);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                  isSelected ? "bg-note-yellow font-bold text-ink-black shadow-xs" : "text-ink-black hover:bg-amber-100/50 font-medium"
                )}
              >
                <span>{size} / {t.common.page}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const HistoryList: React.FC<HistoryListProps> = ({
  items = [],
  isLoading,
  error,
  totalCount,
  totalPages,
  currentPage,
  currentPageSize,
  sortOrder,
  onSortChange,
}) => {
  const { setPage, setPageSize } = useHistoryQueryState();
  const { t } = useLanguage();

  const toggleSort = () => {
    onSortChange(sortOrder === "newest" ? "oldest" : "newest");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 rounded-xl border border-note-yellow/20 bg-amber-50/20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="py-8 text-center text-sm font-semibold text-red-600">
          {t.history.page.failedToLoad}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-2 border-note-yellow/30 bg-[#FFFDF7] shadow-sm">
        <CardContent className="py-12 text-center text-sm font-medium text-pencil-gray">
          {t.history.page.noTransactions}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar: Sort toggle & Page size */}
      <div className="flex items-center justify-between text-xs text-pencil-gray px-1">
        <div>
          {t.history.page.showing} <span className="font-bold text-ink-black">{items.length}</span> {t.history.page.of}{" "}
          <span className="font-bold text-ink-black">{totalCount}</span> {t.history.page.transactions}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 hover:border-gray-300 rounded-xl bg-white text-ink-black font-semibold cursor-pointer shadow-xs transition-all"
            aria-label={t.history.page.sortOrder}
          >
            <ArrowUpDown className="h-4 w-4 text-pencil-gray" />
            {sortOrder === "newest" ? t.history.page.newestFirst : t.history.page.oldestFirst}
          </button>

          <PageSizeDropdown
            currentPageSize={currentPageSize}
            onSelect={(size) => setPageSize(size)}
          />
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <HistoryRow key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-pencil-gray font-medium">
            {t.history.page.pageOf} <span className="font-bold text-ink-black">{currentPage}</span> {t.history.page.of}{" "}
            <span className="font-bold text-ink-black">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(1)}
              className="p-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-amber-50 text-ink-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={t.history.page.firstPage}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-amber-50 text-ink-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={t.history.page.previousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-amber-50 text-ink-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={t.history.page.nextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="p-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-amber-50 text-ink-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={t.history.page.lastPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
