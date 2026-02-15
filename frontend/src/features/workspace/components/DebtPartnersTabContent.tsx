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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = async (data: { name: string; balance: number }) => {
    await createPartner(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (id: string, data: { name: string; balance: number }) => {
    await updatePartner(id, data);
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
              <CardTitle className="text-2xl text-gray-900">Debt Partners</CardTitle>
              <CardDescription className="mt-1">
                Manage your creditors and debt relationships
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={isLoading}
              className="bg-[#FF7A00] hover:bg-[#E56E00] text-white font-bold border border-[#4A2C2A]/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#FF7A00] mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">Loading debt partners...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Failed to load debt partners</p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && partners.length === 0 && (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No debt partners yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add your creditors to track your debts
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-6 bg-amber-300 text-gray-900 font-semibold hover:bg-amber-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Partner
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
            <CardTitle className="text-lg text-gray-900">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {partners.filter((p) => p.balance > 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Receivable</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {partners.filter((p) => p.balance < 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Payable</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {partners.filter((p) => p.balance === 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Neutral</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Net Balance:</span>
                <span className={`text-lg font-bold ${
                  partners.reduce((sum, p) => sum + p.balance, 0) > 0
                    ? "text-green-600"
                    : partners.reduce((sum, p) => sum + p.balance, 0) < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}>
                  {partners.reduce((sum, p) => sum + p.balance, 0).toFixed(2)}
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
            <DialogTitle>Add Debt Partner</DialogTitle>
            <DialogDescription>
              Create a new debt partner to track receivables or payables
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
