"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, HelpCircle, ChevronDown } from "lucide-react";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";
import { useWallets } from "../../wallet/hooks/useWallets";
import { cn } from "@/lib/utils";
import { HistoryKindTag } from "../utils/historyKind";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

type WalletItem = {
  id: string;
  name: string;
};

const HistoryWalletDropdown: React.FC<{
  currentWalletId: string;
  allWallets: WalletItem[];
  allLabel: string;
  onSelect: (id: string) => void;
}> = ({ currentWalletId, allWallets, allLabel, onSelect }) => {
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

  const selectedWallet = allWallets.find((w) => w.id === currentWalletId);

  return (
    <div className="relative min-w-[200px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 text-sm rounded-xl bg-white text-ink-black flex items-center justify-between shadow-xs transition-all cursor-pointer outline-none",
          currentWalletId || isOpen
            ? "border-2 border-note-yellow font-semibold"
            : "border border-gray-200 hover:border-gray-300 font-medium"
        )}
      >
        <span className="truncate">{selectedWallet ? selectedWallet.name : allLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-pencil-gray transition-transform duration-200 ml-2 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl space-y-1 animate-in fade-in-50 zoom-in-95">
          <div
            onClick={() => {
              onSelect("");
              setIsOpen(false);
            }}
            className={cn(
              "px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors",
              !currentWalletId ? "bg-note-yellow font-bold text-ink-black shadow-xs" : "text-ink-black hover:bg-amber-100/50 font-medium"
            )}
          >
              {allLabel}
          </div>
          {allWallets.map((w) => {
            const isSelected = w.id === currentWalletId;
            return (
              <div
                key={w.id}
                onClick={() => {
                  onSelect(w.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                  isSelected ? "bg-note-yellow font-bold text-ink-black shadow-xs" : "text-ink-black hover:bg-amber-100/50 font-medium"
                )}
              >
                <span className="truncate">{w.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const HistoryFilters: React.FC = () => {
  const { inputValue, currentWalletId, currentKind, setSearch, setWalletId, setKind } = useHistoryQueryState();
  const { data: wallets } = useWallets();
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedHelp, setSelectedHelp] = useState<HistoryKindTag | null>(null);
  const { t } = useLanguage();

  const TAG_OPTIONS: { value: HistoryKindTag; label: string }[] = [
    { value: "salary", label: t.history.page.tagHelp.salary.title },
    { value: "bill", label: t.history.page.tagHelp.bill.title },
    { value: "repay", label: t.history.page.tagHelp.repay.title },
    { value: "consume", label: t.history.page.tagHelp.consume.title },
  ];

  const TAG_HELP: Record<HistoryKindTag, { title: string; description: string; usage: readonly string[] }> = {
    salary: {
      title: t.history.page.tagHelp.salary.title,
      description: t.history.page.tagHelp.salary.description,
      usage: t.history.page.tagHelp.salary.usage,
    },
    bill: {
      title: t.history.page.tagHelp.bill.title,
      description: t.history.page.tagHelp.bill.description,
      usage: t.history.page.tagHelp.bill.usage,
    },
    repay: {
      title: t.history.page.tagHelp.repay.title,
      description: t.history.page.tagHelp.repay.description,
      usage: t.history.page.tagHelp.repay.usage,
    },
    consume: {
      title: t.history.page.tagHelp.consume.title,
      description: t.history.page.tagHelp.consume.description,
      usage: t.history.page.tagHelp.consume.usage,
    },
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter out grandchild wallets - only show root wallets and direct children
  const allWallets = useMemo(() => {
    const list = wallets ?? [];
    const rootIds = new Set(list.filter((w) => !w.parentWalletId).map((w) => w.id));
    return list.filter((w) => !w.parentWalletId || rootIds.has(w.parentWalletId));
  }, [wallets]);

  const openHelp = (tag: HistoryKindTag) => {
    setSelectedHelp(tag);
    setHelpOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* First row: Search + Wallet */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pencil-gray" />
            <input
              type="text"
              placeholder={t.history.page.searchPlaceholder}
              value={inputValue ?? ""}
              onChange={onSearchChange}
              aria-label={t.history.page.searchAria}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 hover:border-gray-300 rounded-xl bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-note-yellow/30 text-ink-black font-medium placeholder:text-pencil-gray/70 shadow-xs transition-all"
            />
          </div>

          {/* Custom Wallet Filter Dropdown */}
          <HistoryWalletDropdown
            currentWalletId={currentWalletId ?? ""}
            allWallets={allWallets}
            allLabel={t.common.all}
            onSelect={(id) => setWalletId(id)}
          />
        </div>

        {/* Second row: Tag filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setKind("")}
            className={cn(
              "px-4 py-1.5 text-sm font-bold rounded-full transition-all shadow-xs cursor-pointer",
              !currentKind
                ? "bg-note-yellow text-ink-black border-2 border-note-yellow"
                : "bg-white text-pencil-gray border border-gray-200 hover:bg-gray-50 hover:text-ink-black font-medium"
            )}
          >
            {t.common.all}
          </button>
          {TAG_OPTIONS.map((opt) => {
            const isSelected = currentKind === opt.value;
            return (
              <div key={opt.value} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setKind(isSelected ? "" : opt.value)}
                  className={cn(
                    "px-4 py-1.5 text-sm font-semibold rounded-l-full transition-all border-r-0 shadow-xs cursor-pointer",
                    isSelected
                      ? "bg-note-yellow text-ink-black border-2 border-note-yellow font-bold"
                      : "bg-white text-pencil-gray border border-gray-200 hover:bg-gray-50 hover:text-ink-black font-medium"
                  )}
                >
                  {opt.label}
                </button>
                <button
                  type="button"
                  onClick={() => openHelp(opt.value)}
                  className={cn(
                    "px-2 py-1.5 text-sm rounded-r-full transition-all shadow-xs cursor-pointer",
                    isSelected
                      ? "bg-note-yellow text-ink-black border-2 border-l-0 border-note-yellow hover:bg-amber-400"
                      : "bg-white text-pencil-gray border border-l-0 border-gray-200 hover:bg-gray-50 hover:text-ink-black"
                  )}
                  title={`${t.history.page.commonUsage} ${opt.label}`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tag Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md bg-[#FFFDF7] border-2 border-note-yellow/40 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-ink-black flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              {selectedHelp && TAG_HELP[selectedHelp]?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedHelp && (
            <div className="space-y-4 py-2">
              <p className="text-sm font-medium text-pencil-gray">
                {TAG_HELP[selectedHelp]?.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink-black uppercase tracking-wider">{t.history.page.commonUsage}</h4>
                <ul className="list-disc list-inside text-sm font-medium text-pencil-gray space-y-1">
                  {TAG_HELP[selectedHelp]?.usage.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setHelpOpen(false)}
              className="bg-note-yellow text-ink-black border-2 border-note-yellow font-bold hover:bg-amber-400 rounded-xl"
            >
              {t.common.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
