import React from "react";
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { TransferFormValues } from "../types/transferForm";
import type { WalletDto } from "../types/transfer";
import { WalletSelect } from "@/features/transaction/components/QuickDebt/WalletSelect";

type GroupedWallets = {
  parent: WalletDto | null;
  children: WalletDto[];
};

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
  groupedWallets,
  disabled,
}) => {
  const hasChildWallets = groupedWallets.some((g) => g.children.length > 0);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <WalletSelect
            value={field.value ?? ""}
            onChange={(val) => field.onChange(val)}
            groupedWallets={groupedWallets as any}
            isLoading={false}
            hasWallets={hasChildWallets}
            disabled={disabled}
            error={fieldState.error?.message}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
