"use client";

import React from "react";
import { Search, HelpCircle } from "lucide-react";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";
import { useWallets } from "../../wallet/hooks/useWallets";
import { HistoryKindTag } from "../utils/historyKind";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TAG_OPTIONS: { value: HistoryKindTag; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "bill", label: "Bill" },
  { value: "repay", label: "Repay" },
  { value: "consume", label: "Consume" },
];

const TAG_HELP: Record<HistoryKindTag, { title: string; description: string; usage: string[] }> = {
  salary: {
    title: "Salary (Income)",
    description: "Transactions with positive amount (+), money flowing into your wallet.",
    usage: [
      "Monthly salary, bonuses",
      "Money transferred in",
      "Refunds, cashback",
      "Sales, revenue"
    ],
  },
  bill: {
    title: "Bill (Shared Bills)",
    description: "Transactions related to partners, used to split bills with others.",
    usage: [
      "Dining together, splitting costs",
      "Shared shopping",
      "Expenses to be split",
      "Auto-calculates debt between 2 people"
    ],
  },
  repay: {
    title: "Repay (Debt Repayment)",
    description: "Debt repayment transactions for partners, auto-marked when note contains keyword.",
    usage: [
      "Repay debt to partner",
      "Note contains repayment keyword",
      "Reduces debt balance between 2 people"
    ],
  },
  consume: {
    title: "Consume (Personal Spending)",
    description: "Transactions with negative amount (-), money flowing out of your wallet.",
    usage: [
      "Personal shopping",
      "Bill payments",
      "Withdrawals, transfers out",
      "Daily expenses"
    ],
  },
};

export const HistoryFilters: React.FC = () => {
  const { inputValue, currentWalletId, currentKind, setSearch, setWalletId, setKind } = useHistoryQueryState();
  const { data: wallets } = useWallets();
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [selectedHelp, setSelectedHelp] = React.useState<HistoryKindTag | null>(null);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter out grandchild wallets - only show root wallets and direct children
  const allWallets = React.useMemo(() => {
    const list = wallets ?? [];
    const rootIds = new Set(list.filter(w => !w.parentWalletId).map(w => w.id));
    return list.filter(w => !w.parentWalletId || rootIds.has(w.parentWalletId));
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
            <input
              type="text"
              placeholder="Search by note, partner, wallet..."
              value={inputValue ?? ""}
              onChange={onSearchChange}
              aria-label="Search history"
              className="w-full pl-11 pr-4 py-3 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
            />
          </div>

          {/* Wallet Filter Dropdown */}
          <select
            value={currentWalletId ?? ""}
            onChange={(e) => setWalletId(e.target.value)}
            className="px-4 py-3 text-sm border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow text-ink-black font-medium cursor-pointer min-w-[200px]"
            aria-label="Filter by wallet"
          >
            <option value="">All Wallets</option>
            {allWallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Second row: Tag filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setKind("")}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              !currentKind
                ? "bg-note-yellow text-ink-black"
                : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {TAG_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center">
              <button
                type="button"
                onClick={() => setKind(currentKind === opt.value ? "" : opt.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-full transition-colors ${
                  currentKind === opt.value
                    ? "bg-note-yellow text-ink-black"
                    : "bg-gray-100 text-pencil-gray hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
              <button
                type="button"
                onClick={() => openHelp(opt.value)}
                className={`px-1.5 py-1.5 text-xs transition-colors border-l border-gray-200 ${
                  currentKind === opt.value
                    ? "bg-note-yellow text-ink-black rounded-r-full"
                    : "bg-gray-100 text-pencil-gray hover:bg-gray-200 rounded-r-full"
                }`}
                title={`What is ${opt.label}?`}
              >
                ?
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Help Modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-note-yellow" />
              {selectedHelp && TAG_HELP[selectedHelp].title}
            </DialogTitle>
          </DialogHeader>
          {selectedHelp && (
            <div className="space-y-4">
              <p className="text-sm text-pencil-gray">
                {TAG_HELP[selectedHelp].description}
              </p>
              <div>
                <p className="text-sm font-semibold text-ink-black mb-2">Usage:</p>
                <ul className="text-sm text-ink-black space-y-1">
                  {TAG_HELP[selectedHelp].usage.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-note-yellow mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => setHelpOpen(false)}
                  className="w-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
                >
                  Got it
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryFilters;
