"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { HistoryDto } from "../types/history";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryRow } from "./HistoryRow";
import { useHistoryQueryState, PAGE_SIZE_OPTIONS } from "../hooks/useHistoryQueryState";

type HistoryListProps = {
  items?: HistoryDto[];
  isLoading: boolean;
  error?: any;
  onRefresh?: () => void | Promise<void>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  isLoading,
  error,
  onRefresh,
  totalCount,
  totalPages,
  currentPage,
  currentPageSize,
}) => {
  const { setPage, setPageSize } = useHistoryQueryState();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="text-center text-pencil-gray">Loading history...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-red-600">Failed to load history: {String(error)}</CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-pencil-gray">No history found</CardContent>
      </Card>
    );
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1);
  };

  const handleFirstPage = () => setPage(1);

  const handleLastPage = () => setPage(totalPages);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-2">
          {items.map((it) => (
            <HistoryRow key={it.id} item={it} onRefresh={onRefresh} />
          ))}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        {/* Page info & page size selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-pencil-gray">
            Showing {items.length} of {totalCount} transactions
          </span>
          <select
            value={currentPageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 text-sm border-2 border-note-yellow rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer"
            aria-label="Page size"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 py-1 text-sm font-medium text-ink-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
