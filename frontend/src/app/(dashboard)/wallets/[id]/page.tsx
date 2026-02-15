"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { AttachWalletModal } from "@/features/wallet/components/AttachWalletModal";
import { DetachWalletModal } from "@/features/wallet/components/DetachWalletModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wallet } from "@/features/wallet/types/wallet";
import {
  Wallet,
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  Wallet2,
  DollarSign,
} from "lucide-react";

export default function WalletDetailPage() {
  const params = useParams();
  const walletId = params.id as string;
  const { data: wallets, isLoading, error, refetch } = useWallets();
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isDetachModalOpen, setIsDetachModalOpen] = useState(false);
  const [selectedChildWallet, setSelectedChildWallet] = useState<Wallet | null>(null);

  const parentWallet = wallets?.find((w) => w.id === walletId);
  const childWallets =
    wallets?.filter((w) => w.parentWalletId === walletId) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse h-48"></Card>
          <Card className="animate-pulse h-48"></Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/wallets">
          <Button variant="outline" className="border-note-yellow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Button>
        </Link>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load wallet: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!parentWallet) {
    return (
      <div className="space-y-6">
        <Link href="/wallets">
          <Button variant="outline" className="border-note-yellow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Button>
        </Link>
        <Card className="border-dashed border-2 border-note-yellow/30">
          <CardContent className="p-12 text-center">
            <Wallet className="h-12 w-12 text-pencil-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink-black mb-2">
              Wallet not found
            </h3>
            <p className="text-pencil-gray">
              The wallet you are looking for does not exist
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <h1 className="text-3xl font-bold text-ink-black">
              {parentWallet.name}
            </h1>
            <p className="text-pencil-gray">Parent Wallet</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-md border border-note-yellow px-3 py-1 text-sm text-ink-black">
          <Wallet2 className="h-3 w-3 mr-1" />
          Parent
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="border-note-yellow/30"
          data-testid="parent-overview-stats"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-note-yellow" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-pencil-gray">Current Balance</p>
              <p className="text-3xl font-bold text-ink-black">
                ${(parentWallet.balance || 0).toLocaleString()}
              </p>
            </div>
            {parentWallet.description && (
              <div>
                <p className="text-sm text-pencil-gray">Description</p>
                <p className="text-ink-black">{parentWallet.description}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-pencil-gray">Sub-wallets</span>
                <span className="font-semibold text-ink-black">
                  {childWallets.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-note-yellow/30"
          data-testid="child-wallet-management"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-ink-black flex items-center gap-2">
              <Users className="h-5 w-5 text-note-yellow" />
              Sub-wallets
            </CardTitle>
            <Button
              size="sm"
              className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
              data-testid="attach-child-open"
              onClick={() => setIsAttachModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Attach
            </Button>
          </CardHeader>
          <CardContent>
            {childWallets.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-pencil-gray mx-auto mb-3" />
                <p className="text-pencil-gray text-sm">
                  No sub-wallets attached
                </p>
                <p className="text-xs text-pencil-gray mt-1">
                  Click Attach to add sub-wallets
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {childWallets.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    data-testid="child-wallet-row"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-4 w-4 text-note-yellow" />
                      <div>
                        <p className="font-medium text-ink-black">
                          {child.name}
                        </p>
                        <p className="text-xs text-pencil-gray">
                          ${(child.balance || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      data-testid="detach-child-open"
                      onClick={() => {
                        setSelectedChildWallet(child);
                        setIsDetachModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AttachWalletModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        parentId={walletId}
        availableWallets={wallets || []}
        onSuccess={refetch}
      />

      <DetachWalletModal
        isOpen={isDetachModalOpen}
        onClose={() => {
          setIsDetachModalOpen(false);
          setSelectedChildWallet(null);
        }}
        wallet={selectedChildWallet}
        onSuccess={refetch}
      />
    </div>
  );
}
