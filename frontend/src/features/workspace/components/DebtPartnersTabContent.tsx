"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { DebtPartnerList } from "@/features/debt/components/DebtPartnerList";
import { DebtPartnerForm } from "@/features/debt/components/DebtPartnerForm";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Debt Partners Tab Content
 * 
 * Features:
 * - List all debt partners with balance badges
 * - Create new partner with hybrid balance input
 * - Edit existing partners
 * - Delete partners (soft delete)
 * - Loading states and error handling
 */
export function DebtPartnersTabContent() {
  const {
    partners,
    isLoading,
    error,
    createPartner,
    updatePartner,
    removePartner,
  } = useDebtPartners();
  const { t } = useLanguage();
  const copy = t.dashboard.workspace.debtPartnersTab;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const totalNetBalance = partners.reduce((sum, partner) => sum + partner.balance, 0);
  const totalNetBalanceClassName = [
    "text-lg font-bold",
    totalNetBalance > 0 && "text-green-600",
    totalNetBalance < 0 && "text-red-600",
    totalNetBalance === 0 && "text-gray-600",
  ]
    .filter(Boolean)
    .join(" ");

  const handleCreate = async (data: { name: string; balance?: number }) => {
    await createPartner({ name: data.name, balance: data.balance ?? 0 });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (id: string, data: { name: string; balance?: number }) => {
    await updatePartner(id, { name: data.name, balance: data.balance ?? 0 });
  };

  const handleDelete = async (id: string) => {
    await removePartner(id);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-gray-200 bg-white rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 font-patrick lowercase">{copy.title}</CardTitle>
              <CardDescription className="mt-1">
                {copy.description}
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={isLoading}
              className="bg-[#FF7A00] hover:bg-[#E56E00] text-white font-bold border border-[#4A2C2A]/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              {copy.addButton}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#FF7A00] mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">{copy.loading}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{copy.loadError}</p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && partners.length === 0 && (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">{copy.emptyTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {copy.emptyDescription}
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-6 bg-amber-300 text-gray-900 font-semibold hover:bg-amber-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {copy.emptyAction}
                </Button>
              </div>
            </div>
          )}

          {/* Partner List */}
          {!isLoading && !error && partners.length > 0 && (
            <DebtPartnerList
              partners={partners}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      {!isLoading && !error && partners.length > 0 && (
        <Card className="border-gray-200 bg-white rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">{copy.summaryTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {partners.filter((p) => p.balance > 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">{copy.receivable}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {partners.filter((p) => p.balance < 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">{copy.payable}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {partners.filter((p) => p.balance === 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">{copy.neutral}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{copy.totalNetBalance}</span>
                <span className={totalNetBalanceClassName}>
                  {totalNetBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Partner Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>{copy.createDialogTitle}</DialogTitle>
            <DialogDescription>
              {copy.createDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DebtPartnerForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
