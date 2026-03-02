import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Wallet2 } from "lucide-react";

interface EmptyStateProps {
  hasSearchQuery: boolean;
  hasWallets: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery, hasWallets }) => {
  if (hasSearchQuery) {
    return (
      <Card className="border-note-yellow/30">
        <CardContent className="p-6 text-center">
          <Search className="h-12 w-12 mx-auto text-pencil-gray mb-3 opacity-50" />
          <p className="text-ink-black font-semibold">No wallets found</p>
          <p className="text-sm text-pencil-gray">Try adjusting your search query</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasWallets) {
    return (
      <Card className="border-note-yellow/30">
        <CardContent className="p-6 text-center">
          <Wallet2 className="h-12 w-12 mx-auto text-note-yellow mb-3" />
          <p className="text-ink-black font-semibold">No parent wallets found</p>
          <p className="text-sm text-pencil-gray">Create a parent wallet to begin organizing child wallets.</p>
        </CardContent>
      </Card>
    );
  }

  return null;
};
