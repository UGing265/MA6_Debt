import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";
import type { WalletDto } from "../types/transfer";

type GroupedWallets = {
  parent: WalletDto | null;
  children: WalletDto[];
};

import { formatVnd } from "@/lib/utils";

const getWalletLabel = (wallet: WalletDto, includeBalance = false): string => {
  if (includeBalance) {
    return `${wallet.name} (${formatVnd(wallet.balance)})`;
  }
  return wallet.name;
};

const walletSelectClassName =
  "border-input h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-note-yellow focus-visible:ring-2 focus-visible:ring-note-yellow/30";

interface WalletSelectFieldProps {
  form: UseFormReturn<TransferFormValues>;
  name: "fromWalletId" | "toWalletId";
  label: string;
  placeholder: string;
  groupedWallets: GroupedWallets[];
  disabled: boolean;
  testId: string;
}

export const WalletSelectField: React.FC<WalletSelectFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  groupedWallets,
  disabled,
  testId,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">{label}</FormLabel>
          <FormControl>
            <select {...field} data-testid={testId} disabled={disabled} className={walletSelectClassName}>
              <option value="">{placeholder}</option>
              {groupedWallets.map((group, idx) => (
                <optgroup key={group.parent?.id ?? `orphan-${idx}`} label={group.parent?.name ?? "Other Wallets"}>
                  {group.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {getWalletLabel(child, true)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
