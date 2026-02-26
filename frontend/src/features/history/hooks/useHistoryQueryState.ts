"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

// Minimal URL-driven query state hook for History feature
// Uses URL as single source of truth for cross-component sync
export function useHistoryQueryState() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  // Read directly from URL - this ensures all components stay in sync
  const currentSearch = searchParams.get("search") ?? "";
  const currentWalletId = searchParams.get("walletId") ?? "";
  const currentPartnerId = searchParams.get("partnerId") ?? "";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const currentPageSize = PAGE_SIZE_OPTIONS.includes(parseInt(searchParams.get("pageSize") ?? "10", 10) as PageSizeOption)
    ? (parseInt(searchParams.get("pageSize") ?? "10", 10) as PageSizeOption)
    : 10;

  // Local state for debounced input (UI only)
  const [inputValue, setInputValue] = React.useState<string>(currentSearch);

  // Debounced write to URL for search param
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      const url = new URL(window.location.href);
      if (inputValue) {
        url.searchParams.set("search", inputValue);
      } else {
        url.searchParams.delete("search");
      }
      // Reset to page 1 when search changes
      url.searchParams.delete("page");
      router.replace(`${pathname}${url.search}`, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [inputValue, pathname, router]);

  // Sync inputValue when URL changes externally (e.g., browser back/forward)
  React.useEffect(() => {
    setInputValue(currentSearch);
  }, [currentSearch]);

  // Update URL with all params
  const updateUrl = React.useCallback((updates: { walletId?: string; partnerId?: string; page?: number; pageSize?: number }) => {
    const url = new URL(window.location.href);
    
    if (updates.walletId !== undefined) {
      if (updates.walletId) {
        url.searchParams.set("walletId", updates.walletId);
      } else {
        url.searchParams.delete("walletId");
      }
      // Reset to page 1 when wallet changes
      url.searchParams.delete("page");
    }

    if (updates.partnerId !== undefined) {
      if (updates.partnerId) {
        url.searchParams.set("partnerId", updates.partnerId);
      } else {
        url.searchParams.delete("partnerId");
      }
      // Reset to page 1 when partner changes
      url.searchParams.delete("page");
    }
    
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        url.searchParams.set("page", String(updates.page));
      } else {
        url.searchParams.delete("page");
      }
    }
    
    if (updates.pageSize !== undefined) {
      if (updates.pageSize !== 10) {
        url.searchParams.set("pageSize", String(updates.pageSize));
      } else {
        url.searchParams.delete("pageSize");
      }
      // Reset to page 1 when pageSize changes
      url.searchParams.delete("page");
    }
    
    router.replace(`${pathname}${url.search}`, { scroll: false });
  }, [pathname, router]);

  // Immediate walletId updates
  const setWalletId = React.useCallback((value: string) => {
    updateUrl({ walletId: value });
  }, [updateUrl]);

  // Immediate partnerId updates
  const setPartnerId = React.useCallback((value: string) => {
    updateUrl({ partnerId: value });
  }, [updateUrl]);

  // Setter for search input (debounced to URL in effect)
  const setSearch = React.useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Page navigation
  const setPage = React.useCallback((page: number) => {
    updateUrl({ page });
  }, [updateUrl]);

  // PageSize change
  const setPageSize = React.useCallback((pageSize: number) => {
    updateUrl({ pageSize });
  }, [updateUrl]);

  return {
    currentSearch,
    currentWalletId,
    currentPartnerId,
    currentPage,
    currentPageSize,
    inputValue,
    setSearch,
    setWalletId,
    setPartnerId,
    setPage,
    setPageSize,
  };
}
