"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet2, Pencil, Trash2, Star } from "lucide-react";
import type { Wallet } from "@/features/wallet/types/wallet";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ParentWalletCardProps {
  wallet: Wallet;
  childCount: number;
  aggregatedBalance: number;
  hasDefaultChild: boolean;
  isDeleting: boolean;
  onEdit: (wallet: Wallet) => void;
  onDelete: (wallet: Wallet) => void;
}

export const ParentWalletCard: React.FC<ParentWalletCardProps> = ({
  wallet,
  childCount,
  aggregatedBalance,
  hasDefaultChild,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  return (
    <Link href={`/wallets/${wallet.id}`} data-testid={`parent-wallet-card-${wallet.id}`}>
      <Card
        className={`border-note-yellow/25 cursor-pointer transition-all duration-200 hover:border-note-yellow/60 hover:shadow-md hover:-translate-y-0.5 ${
          hasDefaultChild ? "border-yellow-200 bg-yellow-50/50" : ""
        }`}
      >
        <CardContent className="p-3 md:p-4 space-y-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="h-10 w-10 rounded-xl bg-note-yellow/20 text-note-yellow flex items-center justify-center shrink-0">
                <Wallet2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-left text-2xl font-bold text-ink-black group-hover:text-[#D97706]">
                    {wallet.name}
                  </p>
                  {hasDefaultChild && (
                    <span className="inline-flex items-center gap-1 bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3 fill-current" />
                      {t.wallets.page.card.hasDefault}
                    </span>
                  )}
                </div>
                <p className="text-sm text-pencil-gray">
                  {wallet.description || t.wallets.page.card.noDescription} · {t.wallets.page.detail.subWalletCount.replace("{count}", String(childCount)).replace("{suffix}", childCount !== 1 ? "s" : "")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-orange-500 text-right">{formatVnd(aggregatedBalance)}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-ink-black hover:text-note-yellow shrink-0"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit(wallet);
                }}
                aria-label={t.wallets.page.card.editAria.replace("{name}", wallet.name)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(wallet);
                }}
                aria-label={t.wallets.page.card.deleteAria.replace("{name}", wallet.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
