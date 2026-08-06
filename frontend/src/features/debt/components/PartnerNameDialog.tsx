"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DebtPartnerForm } from "./DebtPartnerForm";
import type { DebtPartner } from "../types/debtPartner";
import { useLanguage } from "@/context/LanguageContext";

interface PartnerNameDialogProps {
  open: boolean;
  partner: DebtPartner | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (partnerId: string, data: { name: string; balance?: number }) => Promise<void>;
}

export function PartnerNameDialog({
  open,
  partner,
  onOpenChange,
  onSubmit,
}: PartnerNameDialogProps) {
  const { t } = useLanguage();
  const handleSubmit = async (data: { name: string; balance?: number }) => {
    if (!partner) {
      return;
    }

    await onSubmit(partner.id, {
      name: data.name,
      balance: partner.balance,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>{t.partners.page.updatePartnerTitle}</DialogTitle>
          <DialogDescription>{t.partners.page.nameDialog.description}</DialogDescription>
        </DialogHeader>
        {partner ? (
          <DebtPartnerForm
            partner={partner}
            mode="name-only"
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
