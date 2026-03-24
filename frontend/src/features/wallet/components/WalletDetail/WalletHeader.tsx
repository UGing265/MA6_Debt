import React from "react";
import Link from "next/link";
import { ArrowLeft, Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Wallet } from "@/features/wallet/types/wallet";

interface WalletHeaderProps {
  wallet: Wallet;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ wallet }) => {
  const isParent = !wallet.parentWalletId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/wallets">
          <Button
            variant="outline"
            size="icon"
            className="border-note-yellow hover:bg-note-yellow/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-ink-black">{wallet.name}</h1>
          <p className="text-pencil-gray">
            {isParent ? "Parent wallet details and child management" : "Sub-wallet details"}
          </p>
        </div>
      </div>
      <span className="inline-flex items-center rounded-md border border-note-yellow px-3 py-1 text-sm text-ink-black">
        <Wallet2 className="h-3 w-3 mr-1" />
        {isParent ? "Parent" : "Sub-wallet"}
      </span>
    </div>
  );
};
