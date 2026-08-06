"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Wallet2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyStateProps {
  hasSearchQuery: boolean;
  hasWallets: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery, hasWallets }) => {
  const { t } = useLanguage();

  if (hasSearchQuery) {
    return (
      <Card className="border-note-yellow/30">
        <CardContent className="p-6 text-center">
          <Search className="h-12 w-12 mx-auto text-pencil-gray mb-3 opacity-50" />
          <p className="text-ink-black font-semibold">{t.wallets.page.empty.noWalletsFound}</p>
          <p className="text-sm text-pencil-gray">{t.wallets.page.empty.createParentToBegin}</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasWallets) {
    return (
      <Card className="border-note-yellow/30">
        <CardContent className="p-6 text-center">
          <Wallet2 className="h-12 w-12 mx-auto text-note-yellow mb-3" />
          <p className="text-ink-black font-semibold">{t.wallets.page.empty.noParentWalletsFound}</p>
          <p className="text-sm text-pencil-gray">{t.wallets.page.empty.createFirstWallet}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
