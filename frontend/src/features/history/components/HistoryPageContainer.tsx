"use client";

import React from "react";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryList } from "./HistoryList";
import { getHistory } from "../api/history";
import { HistoryDto } from "../types/history";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";

export const HistoryPageContainer: React.FC = () => {
  const { currentSearch, currentWalletId } = useHistoryQueryState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<HistoryDto[]>([]);

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
      const data = await getHistory({ search: currentSearch, walletId: currentWalletId || null });
      // Sort by newest first using transactionDate, fallback to createdAt
      const sorted = (data ?? [])
        .slice()
        .sort((a, b) => {
          const ta = new Date(a.transactionDate ?? a.createdAt).getTime();
          const tb = new Date(b.transactionDate ?? b.createdAt).getTime();
          return tb - ta;
        });
      if (mountedRef.current) setItems(sorted);
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
  }, [currentSearch, currentWalletId]);

  // Fetch history when filters change
  React.useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="space-y-4" data-testid="history-page-container">
      <HistoryFilters />
      <HistoryList items={items} isLoading={loading} error={error} onRefresh={fetchHistory} />
    </div>
  );
};

export default HistoryPageContainer;
