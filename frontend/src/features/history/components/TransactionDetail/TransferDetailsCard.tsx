"use client";

import React from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HistoryDto } from "../../types/history";
import { useLanguage } from "@/context/LanguageContext";

interface TransferDetailsCardProps {
  transaction: HistoryDto;
}

export const TransferDetailsCard: React.FC<TransferDetailsCardProps> = ({ transaction }) => {
  const { t } = useLanguage();

  if (!transaction.transferId) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/30 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          {t.history.page.detail.transferDetails}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-pencil-gray">{t.history.page.detail.from}</p>
            <p className="font-bold text-ink-black">{transaction.transferFromWalletName || t.history.page.detail.unknown}</p>
          </div>
          <ArrowLeftRight className="h-6 w-6 text-blue-600" />
          <div className="text-center">
            <p className="text-sm text-pencil-gray">{t.history.page.detail.to}</p>
            <p className="font-bold text-ink-black">{transaction.transferToWalletName || t.history.page.detail.unknown}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
