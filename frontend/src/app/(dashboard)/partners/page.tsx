"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, TrendingDown, TrendingUp, Star } from "lucide-react";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { DebtPartnerForm } from "@/features/debt/components/DebtPartnerForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DebtPartner } from "@/features/debt/types/debtPartner";

function formatVnd(value: number) {
  return `${Math.abs(value).toLocaleString("en-US")}d`;
}

export default function PartnersPage() {
  const { partners, isLoading, error, createPartner, updatePartner, removePartner } = useDebtPartners();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<DebtPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<DebtPartner | null>(null);
  const [defaultPartnerId, setDefaultPartnerId] = useState<string>("");

  // Load default partner from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("defaultPartnerId") || "";
    setDefaultPartnerId(stored);
  }, []);

  // Save/clear default partner
  const setAsDefault = (partnerId: string) => {
    setDefaultPartnerId(partnerId);
    localStorage.setItem("defaultPartnerId", partnerId);
  };

  const clearDefault = () => {
    setDefaultPartnerId("");
    localStorage.removeItem("defaultPartnerId");
  };

  const sortedPartners = [...partners].sort((a, b) => {
    if (b.balance !== a.balance) return b.balance - a.balance;
    return a.name.localeCompare(b.name);
  });

  const handleCreate = async (data: { name: string; balance: number }) => {
    await createPartner(data);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (data: { name: string; balance: number }) => {
    if (!editingPartner) return;
    await updatePartner(editingPartner.id, data);
    setEditingPartner(null);
  };

  const handleDelete = async () => {
    if (!deletingPartner) return;
    await removePartner(deletingPartner.id);
    setDeletingPartner(null);
  };

  return (
    <div data-testid="partners-page-root" className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-bold text-ink-black">Debt Partners</h1>
          <p className="text-pencil-gray mt-2">Manage receivables and payables by partner</p>
        </div>
        <Button
          className="rounded-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse h-36" />
          ))}
        </div>
      ) : null}

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load partners: {error}</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error ? (
        sortedPartners.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedPartners.map((partner, index) => {
              const receivable = partner.balance > 0;
              const payable = partner.balance < 0;
              const neutral = partner.balance === 0;
              return (
                <Card key={partner.id} className="border-note-yellow/25">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-note-yellow/25 text-note-yellow flex items-center justify-center font-bold text-xl">
                          {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-3xl font-semibold text-ink-black">{partner.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          className={`p-2 rounded-md transition-colors ${
                            defaultPartnerId === partner.id
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-pencil-gray hover:text-note-yellow"
                          }`}
                          onClick={() => {
                            if (defaultPartnerId === partner.id) {
                              clearDefault();
                            } else {
                              setAsDefault(partner.id);
                            }
                          }}
                          aria-label={defaultPartnerId === partner.id ? "Unset default partner" : "Set as default partner"}
                        >
                          <Star className="h-4 w-4" fill={defaultPartnerId === partner.id ? "currentColor" : "none"} />
                        </button>
                        <button
                          className="p-2 rounded-md text-ink-black hover:bg-note-yellow/20"
                          onClick={() => setEditingPartner(partner)}
                          aria-label={`Edit ${partner.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 rounded-md text-red-500 hover:bg-red-50"
                          onClick={() => setDeletingPartner(partner)}
                          aria-label={`Delete ${partner.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-lg font-semibold">
                      {receivable ? <TrendingUp className="h-4 w-4 text-green-500" /> : null}
                      {payable ? <TrendingDown className="h-4 w-4 text-red-500" /> : null}
                      <span className={receivable ? "text-green-600" : payable ? "text-red-600" : "text-pencil-gray"}>
                        {receivable ? `They owe me: ${formatVnd(partner.balance)}` : null}
                        {payable ? `I owe them: ${formatVnd(partner.balance)}` : null}
                        {neutral ? "No debt" : null}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-note-yellow/30">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-semibold text-ink-black">No partners yet</p>
              <p className="text-sm text-pencil-gray">Add a partner to start tracking debts.</p>
            </CardContent>
          </Card>
        )
      ) : null}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create Partner</DialogTitle>
            <DialogDescription>Add a partner with receivable or payable balance.</DialogDescription>
          </DialogHeader>
          <DebtPartnerForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editingPartner !== null} onOpenChange={(open) => !open && setEditingPartner(null)}>
        <DialogContent>
          <DialogClose onClose={() => setEditingPartner(null)} />
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>Update partner name and balance.</DialogDescription>
          </DialogHeader>
          {editingPartner ? (
            <DebtPartnerForm partner={editingPartner} onSubmit={handleUpdate} onCancel={() => setEditingPartner(null)} />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={deletingPartner !== null} onOpenChange={(open) => !open && setDeletingPartner(null)}>
        <DialogContent>
          <DialogClose onClose={() => setDeletingPartner(null)} />
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingPartner?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeletingPartner(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
