"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HistoryDto, PayerMode } from "../../types/history";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface DebtInfoCardProps {
  transaction: HistoryDto;
  isRepay: boolean;
}

export const DebtInfoCard: React.FC<DebtInfoCardProps> = ({ transaction, isRepay }) => {
  const { t } = useLanguage();

  if (!transaction.partnerId) return null;

  return (
    <Card className={`border-purple-200 ${isRepay ? "bg-emerald-50/30" : "bg-purple-50/30"}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg flex items-center gap-2 ${isRepay ? "text-emerald-700" : "text-purple-700"}`}>
          <Users className="h-5 w-5" />
          {isRepay ? t.history.page.detail.repayment : t.history.page.detail.debtInfo}
          {isRepay && (
            <span className="ml-auto text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
              {t.history.page.detail.repaid}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg bg-white border ${isRepay ? "border-emerald-200" : "border-purple-200"}`}>
          {transaction.payerMode === PayerMode.ToiTra ? (
            <div>
              <p className="text-xs text-pencil-gray mb-1">
                {isRepay ? t.history.page.detail.youRepaidDebtTo : t.history.page.detail.partnerOwesYou}
              </p>
              <p className={`text-xl font-bold ${isRepay ? "text-emerald-700" : "text-purple-700"}`}>
                {transaction.partnerName}
              </p>
            </div>
          ) : transaction.payerMode === PayerMode.PartnerTra ? (
            <div>
              <p className="text-xs text-pencil-gray mb-1">
                {isRepay ? t.history.page.detail.partnerRepaidDebtToYou : t.history.page.detail.youOwePartner}
              </p>
              <p className={`text-xl font-bold ${isRepay ? "text-emerald-700" : "text-purple-700"}`}>
                {transaction.partnerName}
              </p>
            </div>
          ) : (
            <p className={`text-xl font-bold ${isRepay ? "text-emerald-700" : "text-purple-700"}`}>
              {transaction.partnerName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {transaction.totalAmount != null && (
            <div className="p-2 rounded-lg bg-white border border-gray-200">
              <p className="text-xs text-pencil-gray">{t.history.page.detail.totalBill}</p>
              <p className="text-lg font-bold text-ink-black">{formatVnd(transaction.totalAmount)}</p>
            </div>
          )}
          {transaction.debtAmount != null && transaction.debtAmount !== 0 ? (
            <div
              className={`p-2 rounded-lg ${
                isRepay ? "bg-emerald-100 border-emerald-200" : "bg-purple-100 border-purple-200"
              } border`}
            >
              <p className={`text-xs ${isRepay ? "text-emerald-600" : "text-purple-600"}`}>
                {isRepay
                  ? t.history.page.detail.amountRepaid
                  : transaction.payerMode === PayerMode.ToiTra
                    ? `${transaction.partnerName} ${t.history.page.detail.partnerOwesYou.toLowerCase()}`
                    : `${t.history.page.detail.youOwePartner} ${transaction.partnerName}`}
              </p>
              <p className={`text-lg font-bold ${isRepay ? "text-emerald-700" : "text-purple-700"}`}>
                {formatVnd(transaction.debtAmount)}
              </p>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-600">{t.history.page.detail.debtAmount}</p>
              <p className="text-sm font-medium text-amber-700">{t.history.page.detail.notSet}</p>
            </div>
          )}
        </div>

        {transaction.payerMode != null && (
          <div className="text-sm">
            <span className="text-pencil-gray">{isRepay ? t.history.page.detail.whoRepaid : t.history.page.detail.whoPaid}</span>
            <span className="font-semibold text-ink-black">
              {transaction.payerMode === PayerMode.ToiTra ? "You" : transaction.partnerName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
