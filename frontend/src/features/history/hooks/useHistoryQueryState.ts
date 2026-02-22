"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Minimal URL-driven query state hook for History feature
export function useHistoryQueryState() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  // Initialize from URL
  const initialSearch = searchParams.get("search") ?? "";
  const initialWalletId = searchParams.get("walletId") ?? "";

  const [currentSearch, setCurrentSearch] = React.useState<string>(initialSearch);
  const [currentWalletId, setCurrentWalletId] = React.useState<string>(initialWalletId);

  // Reset token/counter that should update when wallet changes
  const [paginationResetKey, setPaginationResetKey] = React.useState<number>(0);

  // Debounced write to URL for search param
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      // mutate URL while preserving other params
      const url = new URL(window.location.href);
      if (currentSearch) {
        url.searchParams.set("search", currentSearch);
      } else {
        url.searchParams.delete("search");
      }
      // perform replace navigation (no scroll)
      router.replace(`${pathname}${url.search}`, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [currentSearch, pathname, router]);

  // Immediate walletId updates
  const setWalletId = React.useCallback((value: string) => {
    if (value === currentWalletId) return;
    setCurrentWalletId(value);
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("walletId", value);
    } else {
      url.searchParams.delete("walletId");
    }
    router.replace(`${pathname}${url.search}`, { scroll: false });
    setPaginationResetKey((k) => k + 1);
  }, [currentWalletId, pathname, router]);

  // Simple setter for search (debounced in effect)
  const setSearch = React.useCallback((value: string) => {
    setCurrentSearch(value);
  }, []);

  return {
    currentSearch,
    currentWalletId,
    setSearch,
    setWalletId,
    paginationResetKey,
  };
}
