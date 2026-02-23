"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Minimal URL-driven query state hook for History feature
// Uses URL as single source of truth for cross-component sync
export function useHistoryQueryState() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  // Read directly from URL - this ensures all components stay in sync
  const currentSearch = searchParams.get("search") ?? "";
  const currentWalletId = searchParams.get("walletId") ?? "";

  // Local state for debounced input (UI only)
  const [inputValue, setInputValue] = React.useState<string>(currentSearch);

  // Reset token/counter that should update when wallet changes
  const [paginationResetKey, setPaginationResetKey] = React.useState<number>(0);

  // Debounced write to URL for search param
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      const url = new URL(window.location.href);
      if (inputValue) {
        url.searchParams.set("search", inputValue);
      } else {
        url.searchParams.delete("search");
      }
      router.replace(`${pathname}${url.search}`, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [inputValue, pathname, router]);

  // Sync inputValue when URL changes externally (e.g., browser back/forward)
  React.useEffect(() => {
    setInputValue(currentSearch);
  }, [currentSearch]);

  // Immediate walletId updates
  const setWalletId = React.useCallback((value: string) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("walletId", value);
    } else {
      url.searchParams.delete("walletId");
    }
    router.replace(`${pathname}${url.search}`, { scroll: false });
    setPaginationResetKey((k) => k + 1);
  }, [pathname, router]);

  // Setter for search input (debounced to URL in effect)
  const setSearch = React.useCallback((value: string) => {
    setInputValue(value);
  }, []);

  return {
    currentSearch,
    currentWalletId,
    inputValue,
    setSearch,
    setWalletId,
    paginationResetKey,
  };
}
