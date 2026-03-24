"use client";

import React, { useState } from "react";
import { Pencil, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PartnerNameDialog } from "./PartnerNameDialog";
import { PartnerMoneyDialog } from "./PartnerMoneyDialog";
import type { DebtPartner } from "../types/debtPartner";
import { cn, formatVnd } from "@/lib/utils";

interface DebtPartnerListProps {
  partners: DebtPartner[];
  onUpdate: (id: string, data: { name: string; balance?: number }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/**
 * List view for debt partners with badge indicators
 * Shows:
 * - Partner name
 * - Balance with color-coded badge (receivable/payable/neutral)
 * - Edit and delete actions
 */
export function DebtPartnerList({
  partners,
  onUpdate,
  onDelete,
}: DebtPartnerListProps) {
  const [nameDialogPartner, setNameDialogPartner] = useState<DebtPartner | null>(null);
  const [moneyDialogPartner, setMoneyDialogPartner] = useState<DebtPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<DebtPartner | null>(null);

  // Get badge info based on balance
  const getBadgeInfo = (balance: number) => {
    if (balance > 0) {
      return {
        label: "Receivable",
        description: "Partner owes me",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: TrendingUp,
      };
    } else if (balance < 0) {
      return {
        label: "Payable",
        description: "I owe partner",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: TrendingDown,
      };
    } else {
      return {
        label: "Neutral",
        description: "No debt",
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: Minus,
      };
    }
  };

  const handleNameSubmit = async (id: string, data: { name: string; balance?: number }) => {
    if (!nameDialogPartner) return;
    await onUpdate(nameDialogPartner.id, { name: data.name, balance: nameDialogPartner.balance });
    setNameDialogPartner(null);
  };
  const handleMoneySubmit = async (id: string, data: { name: string; balance?: number }) => {
    if (!moneyDialogPartner) return;
    await onUpdate(moneyDialogPartner.id, { name: moneyDialogPartner.name, balance: data.balance ?? 0 });
    setMoneyDialogPartner(null);
  };

  const handleDelete = async () => {
    if (deletingPartner) {
      await onDelete(deletingPartner.id);
      setDeletingPartner(null);
    }
  };

  if (partners.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => {
          const badgeInfo = getBadgeInfo(partner.balance);
          const BadgeIcon = badgeInfo.icon;

          return (
            <Card
              key={partner.id}
              className="border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {partner.name}
                    </h3>
                  </div>
                    <div className="flex gap-1 ml-2">
                    <button
                      type="button"
                      aria-label={`Edit name for ${partner.name}`}
                      onClick={() => setNameDialogPartner(partner)}
                      className="p-2 inline-flex items-center justify-center rounded-md text-gray-600 hover:text-note-yellow hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit balance for ${partner.name}`}
                      onClick={() => setMoneyDialogPartner(partner)}
                      className="p-2 inline-flex items-center justify-center rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPartner(partner)}
                      aria-label={`Delete partner ${partner.name}`}
                      className="p-2 inline-flex items-center justify-center rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Balance Badge */}
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium text-sm",
                    badgeInfo.color
                  )}
                >
                  <BadgeIcon className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-bold">
                      {formatVnd(Math.abs(partner.balance))}
                    </span>
                    <span className="text-xs opacity-80">{badgeInfo.label}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-2">
                  {badgeInfo.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Name-only Dialog */}
      <PartnerNameDialog
        open={nameDialogPartner !== null}
        partner={nameDialogPartner}
        onOpenChange={(open) => {
          if (!open) setNameDialogPartner(null);
        }}
        onSubmit={handleNameSubmit}
      />

      {/* Money dialog */}
      <PartnerMoneyDialog
        open={moneyDialogPartner !== null}
        partner={moneyDialogPartner}
        onOpenChange={(open) => {
          if (!open) setMoneyDialogPartner(null);
        }}
        onSubmit={handleMoneySubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingPartner !== null}
        onOpenChange={(open) => !open && setDeletingPartner(null)}
      >
        <DialogContent>
          <DialogClose onClose={() => setDeletingPartner(null)} />
          <DialogHeader>
            <DialogTitle>Delete Debt Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingPartner?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletingPartner(null)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
