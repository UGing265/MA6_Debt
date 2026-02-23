"use client";

import React from "react";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryList } from "./HistoryList";
import { getHistory, PagedResult } from "../api/history";
import { HistoryDto } from "../types/history";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";

export const HistoryPageContainer: React.FC = () => {
  const { currentSearch, currentWalletId, currentPage, currentPageSize } = useHistoryQueryState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<HistoryDto[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);

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
        page: currentPage,
        pageSize: currentPageSize,
      });
      if (mountedRef.current) {
        setItems(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
        setTotalPages(data.totalPages ?? 0);
      }
    } catch (e: any) {
      const msg =
        (typeof e?.general === "string" && e.general.trim().length > 0)
          ? e.general
          : (typeof e?.message === "string" && e.message.trim().length > 0)
            ? e.message
            : String(e);
      if (mountedRef.current) setError(msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [currentSearch, currentWalletId, currentPage, currentPageSize]);

  // Fetch history when filters change
  React.useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="space-y-4" data-testid="history-page-container">
      <HistoryFilters />
      <HistoryList
        items={items}
        isLoading={loading}
        error={error}
        onRefresh={fetchHistory}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        currentPageSize={currentPageSize}
      />
    </div>
  );
};

export default HistoryPageContainer;
