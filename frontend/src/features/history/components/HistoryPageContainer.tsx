"use client";

import React from "react";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryList } from "./HistoryList";
import { getHistory, PagedResult } from "../api/history";
import { HistoryDto } from "../types/history";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";

export const HistoryPageContainer: React.FC = () => {
  const { currentSearch, currentWalletId, currentPartnerId, currentPage, currentPageSize } = useHistoryQueryState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<HistoryDto[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");

  const mountedRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchHistory = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: PagedResult<HistoryDto> = await getHistory({
        search: currentSearch,
        walletId: currentWalletId || null,
        partnerId: currentPartnerId || null,
        page: currentPage,
        pageSize: currentPageSize,
      });
      if (mountedRef.current) {
        // Sort items based on sortOrder
        const sortedItems = [...(data.items ?? [])].sort((a, b) => {
          const dateA = new Date(a.transactionDate ?? a.createdAt).getTime();
          const dateB = new Date(b.transactionDate ?? b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });
        
        setItems(sortedItems);
        setTotalCount(data.totalCount ?? 0);
        setTotalPages(data.totalPages ?? 0);
      }
    } catch (e: any) {
      const msg =
        typeof e?.general === "string" && e.general.trim().length > 0
          ? e.general
          : typeof e?.message === "string" && e.message.trim().length > 0
            ? e.message
            : String(e);
      if (mountedRef.current) setError(msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [currentSearch, currentWalletId, currentPartnerId, currentPage, currentPageSize, sortOrder]);

  // Fetch history when filters change
  React.useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const handleSortChange = React.useCallback((order: "newest" | "oldest") => {
    setSortOrder(order);
  }, []);

  return (
    <div className="space-y-4" data-testid="history-page-container">
      <HistoryFilters />
      <HistoryList
        items={items}
        isLoading={loading}
        error={error}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default HistoryPageContainer;
