import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, WalletIcon, Star, Pencil, Trash2 } from "lucide-react";
import type { Wallet } from "@/features/wallet/types/wallet";
import { formatVnd } from "@/lib/utils";

interface ChildWalletListProps {
  childWallets: Wallet[];
  defaultWalletId: string;
  onCreate: () => void;
  onEdit: (wallet: Wallet) => void;
  onDelete: (wallet: Wallet) => void;
  onSetDefault: (walletId: string) => void;
  onClearDefault: () => void;
}

export const ChildWalletList: React.FC<ChildWalletListProps> = ({
  childWallets,
  defaultWalletId,
  onCreate,
  onEdit,
  onDelete,
  onSetDefault,
  onClearDefault,
}) => {
  return (
    <section data-testid="subwallet-section">
      <Card className="border-note-yellow/30" data-testid="child-wallet-management">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
            <Users className="h-5 w-5 text-note-yellow" />
            Sub-wallets
          </CardTitle>
          <Button
            size="sm"
            className="bg-note-yellow text-ink-black hover:bg-note-yellow/90 font-semibold"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </CardHeader>
        <CardContent>
          {childWallets.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-pencil-gray mx-auto mb-3" />
              <p className="text-pencil-gray text-sm">No sub-wallets attached</p>
              <p className="text-xs text-pencil-gray mt-1">Click Create Child Wallet to add sub-wallets</p>
            </div>
          ) : (
            <div className="space-y-2">
              {childWallets.map((child) => {
                const isDefault = defaultWalletId === child.id;
                return (
                  <div
                    key={child.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isDefault ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    data-testid={`child-wallet-row-${child.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <WalletIcon className="h-4 w-4 text-note-yellow" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-ink-black">{child.name}</p>
                          {isDefault && (
                            <span className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                              <Star className="h-3 w-3 fill-current" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-pencil-gray">{formatVnd(child.balance || 0)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          isDefault
                            ? "text-yellow-500 hover:text-yellow-600"
                            : "text-pencil-gray hover:text-note-yellow"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (isDefault) {
                            onClearDefault();
                          } else {
                            onSetDefault(child.id);
                          }
                        }}
                        aria-label={isDefault ? "Unset as default" : `Set as default for ${child.name}`}
                      >
                        <Star className="h-4 w-4" fill={isDefault ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-ink-black hover:bg-note-yellow/10"
                        data-testid={`detail-child-edit-${child.id}`}
                        onClick={() => onEdit(child)}
                        aria-label={`Edit ${child.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        data-testid={`detail-child-delete-${child.id}`}
                        onClick={() => onDelete(child)}
                        aria-label={`Delete ${child.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
