import React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HistoryDto } from "../../types/history";

interface TransferDetailsCardProps {
  transaction: HistoryDto;
}

export const TransferDetailsCard: React.FC<TransferDetailsCardProps> = ({ transaction }) => {
  if (!transaction.transferId) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/30 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          Transfer Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-pencil-gray">From</p>
            <p className="font-bold text-ink-black">{transaction.transferFromWalletName || "Unknown"}</p>
          </div>
          <ArrowLeftRight className="h-6 w-6 text-blue-600" />
          <div className="text-center">
            <p className="text-sm text-pencil-gray">To</p>
            <p className="font-bold text-ink-black">{transaction.transferToWalletName || "Unknown"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
