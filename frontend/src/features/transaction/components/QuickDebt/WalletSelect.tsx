import React from "react";
import type { Wallet } from "@/features/wallet/types/wallet";
import { formatVnd } from "@/lib/utils";

type GroupedWallets = {
  parent: Wallet | null;
  children: Wallet[];
};

interface WalletSelectProps {
  value: string;
  onChange: (value: string) => void;
  groupedWallets: GroupedWallets[];
  isLoading: boolean;
  hasWallets: boolean;
  disabled: boolean;
  error?: string;
}

export const WalletSelect: React.FC<WalletSelectProps> = ({
  value,
  onChange,
  groupedWallets,
  isLoading,
  hasWallets,
  disabled,
  error,
}) => {
  const getPlaceholder = () => {
    if (isLoading) return "Loading...";
    if (!hasWallets) return "No child wallets";
    return "Select wallet";
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-left text-xs font-medium text-pencil-gray">Child Wallet</label>
      <select
        data-testid="qd-wallet"
        disabled={disabled || isLoading || !hasWallets}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{getPlaceholder()}</option>
        {groupedWallets.map((group, idx) => (
          <optgroup key={group.parent?.id ?? `orphan-${idx}`} label={group.parent?.name ?? "Other"}>
            {group.children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({formatVnd(child.balance)})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
