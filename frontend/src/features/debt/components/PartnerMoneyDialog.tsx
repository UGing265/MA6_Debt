"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DebtPartnerForm } from "./DebtPartnerForm";
import type { DebtPartnerFormMode } from "./DebtPartnerForm";
import type { DebtPartner } from "../types/debtPartner";

interface PartnerMoneyDialogProps {
  open: boolean;
  partner: DebtPartner | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (partnerId: string, data: { name: string; balance?: number }) => Promise<void>;
}

export function PartnerMoneyDialog({ open, partner, onOpenChange, onSubmit }: PartnerMoneyDialogProps) {
  // Adapter to align with DebtPartnerForm's onSubmit(data, mode?) signature
  const handleSubmit = async (
    data: { name: string; balance?: number },
    _mode?: DebtPartnerFormMode
  ) => {
    if (!partner) return;
    // Preserve name, update balance for the specific partner
    await onSubmit(partner.id, { name: partner.name, balance: data.balance ?? 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Edit Debt Partner Balance</DialogTitle>
          <DialogDescription>
            Adjust the partner's balance. Name remains unchanged in this dialog.
          </DialogDescription>
        </DialogHeader>
        {partner ? (
          <DebtPartnerForm
            partner={partner}
            mode="money-only"
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
