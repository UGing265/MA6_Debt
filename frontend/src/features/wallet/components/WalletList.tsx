"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteWallet } from "../hooks/useWallets";
import type { Wallet } from "../types/wallet";

interface WalletListProps {
  wallets: Wallet[];
  onEdit?: (wallet: Wallet) => void;
}

/**
 * Tree node representing a wallet and its children
 */
export interface WalletTreeNode {
  wallet: Wallet;
  depth: number;
  children: WalletTreeNode[];
}

/**
 * Builds a tree structure from a flat array of wallets
 * - Identifies root wallets (no parentWalletId)
 * - Groups children under their parent
 * - Handles orphaned wallets by placing them at root level
 * - Prevents infinite loops with circular references
 *
 * @param wallets - Flat array of wallets from API
 * @returns Array of root-level tree nodes
 */
export function buildWalletTree(wallets: Wallet[]): WalletTreeNode[] {
  if (!wallets || wallets.length === 0) {
    return [];
  }

  // Create a map for O(1) wallet lookups
  const walletMap = new Map(wallets.map((w) => [w.id, w]));

  // Track visited nodes to prevent infinite loops
  const visited = new Set<string>();

  /**
   * Recursively build tree for a wallet and its children
   */
  function buildNode(walletId: string, depth: number): WalletTreeNode | null {
    // Prevent circular references
    if (visited.has(walletId)) {
      return null;
    }

    const wallet = walletMap.get(walletId);
    if (!wallet) {
      return null;
    }

    visited.add(walletId);

    // Find children and build their nodes
    const children = wallets
      .filter((w) => w.parentWalletId === walletId)
      .map((childWallet) => buildNode(childWallet.id, depth + 1))
      .filter((node): node is WalletTreeNode => node !== null)
      .sort((a, b) => a.wallet.name.localeCompare(b.wallet.name));

    return {
      wallet,
      depth,
      children,
    };
  }

  // Build root nodes (wallets with no parent)
  const rootNodes = wallets
    .filter((w) => !w.parentWalletId)
    .map((rootWallet) => buildNode(rootWallet.id, 0))
    .filter((node): node is WalletTreeNode => node !== null)
    .sort((a, b) => a.wallet.name.localeCompare(b.wallet.name));

  // Find orphaned wallets (children whose parent doesn't exist)
  const allProcessedIds = new Set<string>();
  function collectIds(node: WalletTreeNode): void {
    allProcessedIds.add(node.wallet.id);
    node.children.forEach(collectIds);
  }
  rootNodes.forEach(collectIds);

  const orphanedWallets = wallets.filter(
    (w) => w.parentWalletId && !walletMap.has(w.parentWalletId)
  );

  // Add orphaned wallets at root level
  const orphanedNodes = orphanedWallets
    .map((orphan) => buildNode(orphan.id, 0))
    .filter((node): node is WalletTreeNode => node !== null)
    .sort((a, b) => a.wallet.name.localeCompare(b.wallet.name));

  return [...rootNodes, ...orphanedNodes];
}

export const WalletList = ({ wallets, onEdit }: WalletListProps) => {
  const deleteMutation = useDeleteWallet();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wallet?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(balance);
  };

  if (!wallets || wallets.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No wallets found. Create your first wallet to get started!</p>
      </div>
    );
  }

  const tree = buildWalletTree(wallets);

  const renderTreeNode = (node: WalletTreeNode): React.ReactNode => {
    const indent = node.depth * 24;
    const isChild = node.depth > 0;

    return (
      <div key={node.wallet.id}>
        <div
          className={`p-4 border border-[#1F2937]/10 rounded-lg shadow-sm bg-[#FFFBEB] hover:shadow-md transition-shadow ${isChild ? 'mt-2' : 'mt-4'}`}
          style={{ marginLeft: `${indent}px` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#1F2937]">{node.wallet.name}</h3>
                {isChild && (
                  <span className="text-xs px-2 py-0.5 bg-[#FCD34D]/20 text-[#D97706] rounded-full">
                    Sub-wallet
                  </span>
                )}
              </div>
              {node.wallet.description && (
                <p className="text-sm text-gray-600 mt-1">{node.wallet.description}</p>
              )}
              <p className="text-2xl font-bold text-[#FCD34D] mt-2">
                {formatBalance(node.wallet.balance)}
              </p>
              {node.children.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Contains {node.children.length} sub-wallet{node.children.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onEdit(node.wallet)}
                  className="border-[#1F2937]/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => handleDelete(node.wallet.id)}
                disabled={deletingId === node.wallet.id}
              >
                {deletingId === node.wallet.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {node.children.map((child) => renderTreeNode(child))}
      </div>
    );
  };

  return (
    <div className="space-y-0">
      {tree.map((node) => renderTreeNode(node))}
    </div>
  );
};
