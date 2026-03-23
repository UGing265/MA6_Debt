"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wallet } from "@/features/wallet/types/wallet";
import { ArrowLeft, WalletIcon } from "lucide-react";
import { getUserPreferences, updateDefaultWallet } from "@/features/user/api/userApi";
import { WalletHeader, WalletOverviewCard, ChildWalletList, WalletDialogs } from "@/features/wallet/components/WalletDetail";

const isMountedRef = { current: true };

export default function WalletDetailPage() {
  const params = useParams();
  const walletId = params.id as string;
  const { data: wallets, isLoading, error, refetch } = useWallets();

  const [isCreateChildModalOpen, setIsCreateChildModalOpen] = useState(false);
  const [isDetachModalOpen, setIsDetachModalOpen] = useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
  const [editingChildWallet, setEditingChildWallet] = useState<Wallet | null>(null);
  const [selectedChildWallet, setSelectedChildWallet] = useState<Wallet | null>(null);
  const [isEditParentModalOpen, setIsEditParentModalOpen] = useState(false);
  const [defaultWalletId, setDefaultWalletId] = React.useState<string>("");

  // Load default wallet from API
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        if (isMountedRef.current) {
          setDefaultWalletId(prefs.defaultWalletId || "");
        }
      } catch {
        const stored = localStorage.getItem("defaultWalletId") || "";
        if (isMountedRef.current) {
          setDefaultWalletId(stored);
        }
      }
    };
    loadPreferences();
  }, []);

  const setAsDefault = async (walletId: string) => {
    setDefaultWalletId(walletId);
    localStorage.setItem("defaultWalletId", walletId);
    try {
      await updateDefaultWallet(walletId);
    } catch {
      // Silently fail
    }
  };

  const clearDefault = async () => {
    setDefaultWalletId("");
    localStorage.removeItem("defaultWalletId");
    try {
      await updateDefaultWallet(null);
    } catch {
      // Silently fail
    }
  };

  const parentWallet = wallets?.find((w) => w.id === walletId);
  const childWallets = wallets?.filter((w) => w.parentWalletId === walletId) || [];

  // Handlers for child wallet actions
  const handleCreateChild = () => {
    setIsDetachModalOpen(false);
    setSelectedChildWallet(null);
    setIsEditChildModalOpen(false);
    setEditingChildWallet(null);
    setIsCreateChildModalOpen(true);
  };

  const handleEditChild = (wallet: Wallet) => {
    setIsDetachModalOpen(false);
    setSelectedChildWallet(null);
    setIsCreateChildModalOpen(false);
    setEditingChildWallet(wallet);
    setIsEditChildModalOpen(true);
  };

  const handleDeleteChild = (wallet: Wallet) => {
    setIsEditChildModalOpen(false);
    setEditingChildWallet(null);
    setIsCreateChildModalOpen(false);
    setSelectedChildWallet(wallet);
    setIsDetachModalOpen(true);
  };

  const handleCloseEditChild = () => {
    setIsEditChildModalOpen(false);
    setEditingChildWallet(null);
  };

  const handleCloseDetach = () => {
    setIsDetachModalOpen(false);
    setSelectedChildWallet(null);
  };

  // Loading state
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

  // Error state
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
            <p className="text-red-600">Failed to load wallet: {String(error)}</p>
            <div className="pt-4">
              <Button variant="outline" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
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
            <WalletIcon className="h-12 w-12 text-pencil-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-ink-black mb-2">Wallet not found</h3>
            <p className="text-pencil-gray">The wallet you are looking for does not exist</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WalletHeader wallet={parentWallet} />

      <WalletOverviewCard
        wallet={parentWallet}
        childWallets={childWallets}
        defaultWalletId={defaultWalletId}
        onEdit={() => setIsEditParentModalOpen(true)}
        onSetDefault={setAsDefault}
        onClearDefault={clearDefault}
      />

      <ChildWalletList
        childWallets={childWallets}
        defaultWalletId={defaultWalletId}
        onCreate={handleCreateChild}
        onEdit={handleEditChild}
        onDelete={handleDeleteChild}
        onSetDefault={setAsDefault}
        onClearDefault={clearDefault}
      />

      <WalletDialogs
        walletId={walletId}
        parentWallet={parentWallet}
        editingChildWallet={editingChildWallet}
        selectedChildWallet={selectedChildWallet}
        isEditParentOpen={isEditParentModalOpen}
        isCreateChildOpen={isCreateChildModalOpen}
        isEditChildOpen={isEditChildModalOpen}
        isDetachOpen={isDetachModalOpen}
        onCloseEditParent={() => setIsEditParentModalOpen(false)}
        onCloseCreateChild={() => setIsCreateChildModalOpen(false)}
        onCloseEditChild={handleCloseEditChild}
        onCloseDetach={handleCloseDetach}
        onRefetch={refetch}
      />
    </div>
  );
}
