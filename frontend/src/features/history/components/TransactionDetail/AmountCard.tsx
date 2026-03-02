import React from "react";
import { Edit2, Trash2, ArrowLeftRight, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistoryDto, TransferDirection } from "../../types/history";
import { formatVnd } from "@/lib/utils";

interface AmountCardProps {
  transaction: HistoryDto;
  isLocked: boolean;
  lockReason: string;
  onEdit: () => void;
  onDelete: () => void;
  onAddDebt: () => void;
}

export const AmountCard: React.FC<AmountCardProps> = ({
  transaction,
  isLocked,
  lockReason,
  onEdit,
  onDelete,
  onAddDebt,
}) => {
  const amount = transaction.amount ?? 0;
  const isTransfer = transaction.transferId != null;
  const direction = transaction.transferDirection ?? null;
  const absAmount = Math.abs(amount);

  const sign = isTransfer
    ? direction === TransferDirection.Incoming
      ? "+"
      : "-"
    : amount >= 0
    ? "+"
    : "-";

  const transferLabel = isTransfer
    ? direction === TransferDirection.Incoming
      ? "Transfer In"
      : "Transfer Out"
    : "";

  const amountColor = isTransfer
    ? direction === TransferDirection.Incoming
      ? "text-green-600"
      : "text-red-600"
    : amount >= 0
    ? "text-green-600"
    : "text-red-600";

  return (
    <Card className="border-note-yellow/30">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-pencil-gray">Amount</p>
            <p className={`text-4xl font-bold ${amountColor}`}>
              {sign}
              {formatVnd(absAmount)}
            </p>
            {isTransfer && (
              <span
                className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm ${
                  direction === TransferDirection.Incoming
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <ArrowLeftRight className="h-4 w-4 mr-1" />
                {transferLabel}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!isTransfer && (
              <Button
                className="bg-note-yellow text-ink-black hover:bg-note-yellow/90 border border-note-yellow"
                onClick={onAddDebt}
                disabled={isLocked}
                title={isLocked ? lockReason : transaction.partnerId ? "Edit debt info" : "Add debt info"}
              >
                <Banknote className="h-4 w-4 mr-2" />
                {transaction.partnerId ? "Edit Debt" : "Add Debt"}
              </Button>
            )}
            <Button
              className="bg-note-yellow text-ink-black hover:bg-note-yellow/90 border border-note-yellow"
              onClick={onEdit}
              disabled={isLocked}
              title={isLocked ? lockReason : "Edit transaction"}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isLocked}
              title={isLocked ? lockReason : "Delete transaction"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
