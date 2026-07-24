"use client";

import React from "react";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryList } from "./HistoryList";
import { getHistory, PagedResult, subscribeToHistoryRefresh } from "../api/history";
import { HistoryDto } from "../types/history";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";
import { getHistoryKind, HistoryKindTag } from "../utils/historyKind";
import { Card } from "@/components/ui/card";

export const HistoryPageContainer: React.FC = () => {
  const { currentSearch, currentWalletId, currentPartnerId, currentKind, currentPage, currentPageSize } = useHistoryQueryState();
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
      // When tag filter is active, fetch more data to filter from
      // Use a larger page size to get more results
      const effectivePageSize = currentKind ? 100 : currentPageSize;

      const data: PagedResult<HistoryDto> = await getHistory({
        search: currentSearch,
        walletId: currentWalletId || null,
        partnerId: currentPartnerId || null,
        page: currentKind ? 1 : currentPage, // Reset to page 1 when filtering
        pageSize: effectivePageSize,
      });
      if (mountedRef.current) {
        // Sort items based on sortOrder
        let processedItems = [...(data.items ?? [])].sort((a, b) => {
          const dateA = new Date(a.transactionDate ?? a.createdAt).getTime();
          const dateB = new Date(b.transactionDate ?? b.createdAt).getTime();
          return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

        // Apply client-side kind filter
        if (currentKind) {
          processedItems = processedItems.filter((item) => {
            const kind = getHistoryKind(item);
            return kind === currentKind;
          });
        }

        setItems(processedItems);
        setTotalCount(currentKind ? processedItems.length : (data.totalCount ?? 0));
        setTotalPages(currentKind ? 1 : (data.totalPages ?? 0));
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
  }, [currentSearch, currentWalletId, currentPartnerId, currentKind, currentPage, currentPageSize, sortOrder]);

  // Fetch history when filters change
  React.useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  // Subscribe to history refresh events (triggered after transaction submission)
  React.useEffect(() => {
    const unsubscribe = subscribeToHistoryRefresh(() => {
      void fetchHistory();
    });
    return unsubscribe;
  }, [fetchHistory]);

  const handleSortChange = React.useCallback((order: "newest" | "oldest") => {
    setSortOrder(order);
  }, []);

  return (
    <Card className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6" data-testid="history-page-container">
      <HistoryFilters />
      <HistoryList
        items={items}
        isLoading={loading}
        error={error}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentKind ? 1 : currentPage}
        currentPageSize={currentPageSize}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
    </Card>
  );
};

export default HistoryPageContainer;
