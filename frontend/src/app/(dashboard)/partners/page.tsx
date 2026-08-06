"use client";

import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, TrendingDown, TrendingUp, Star, HandCoins, Search } from "lucide-react";
import { formatVnd } from "@/lib/utils";
import { useDebtPartners } from "@/features/debt/hooks/useDebtPartners";
import { PartnerNameDialog } from "@/features/debt/components/PartnerNameDialog";
import { PartnerMoneyDialog } from "@/features/debt/components/PartnerMoneyDialog";
import { PartnerRepaymentDialog } from "@/features/debt/components/PartnerRepaymentDialog";
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
import { getUserPreferences, updateDefaultPartner } from "@/features/user/api/userApi";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage } from "@/context/LanguageContext";

const isMountedRef = { current: true };

import { usePrivacy } from "@/context/PrivacyContext";

export default function PartnersPage() {
  const { t } = useLanguage();
  const { tempShow } = usePrivacy();
  const { partners, isLoading, error, createPartner, updatePartner, removePartner } = useDebtPartners();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nameDialogPartner, setNameDialogPartner] = useState<DebtPartner | null>(null);
  const [moneyDialogPartner, setMoneyDialogPartner] = useState<DebtPartner | null>(null);
  const [repaymentPartner, setRepaymentPartner] = useState<DebtPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<DebtPartner | null>(null);
  const [defaultPartnerId, setDefaultPartnerId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load default partner from API
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        if (isMountedRef.current) {
          setDefaultPartnerId(prefs.defaultPartnerId || "");
        }
      } catch {
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem("defaultPartnerId") || "";
        if (isMountedRef.current) {
          setDefaultPartnerId(stored);
        }
      }
    };
    loadPreferences();
  }, []);

  // Save/clear default partner via API (also update localStorage for other components)
  const setAsDefault = async (partnerId: string) => {
    setDefaultPartnerId(partnerId);
    localStorage.setItem("defaultPartnerId", partnerId);
    try {
      await updateDefaultPartner(partnerId);
    } catch {
      // Silently fail, keep local state
    }
  };

  const clearDefault = async () => {
    setDefaultPartnerId("");
    localStorage.removeItem("defaultPartnerId");
    try {
      await updateDefaultPartner(null);
    } catch {
      // Silently fail, keep local state
    }
  };

  // Filter and sort partners: starred first, then by balance, then by name
  const sortedPartners = useMemo(() => {
    let result = [...partners];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Sort: starred first, then by balance, then by name
    result.sort((a, b) => {
      const aIsStarred = defaultPartnerId === a.id;
      const bIsStarred = defaultPartnerId === b.id;

      // Starred partners always come first
      if (aIsStarred && !bIsStarred) return -1;
      if (!aIsStarred && bIsStarred) return 1;

      // Then sort by balance
      if (b.balance !== a.balance) return b.balance - a.balance;

      // Then sort by name
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [partners, defaultPartnerId, searchQuery]);

  const handleCreate = async (data: { name: string; balance?: number }) => {
    await createPartner({ name: data.name, balance: data.balance ?? 0 });
    setIsCreateOpen(false);
  };

  const handleNameSubmit = async (id: string, data: { name: string; balance?: number }) => {
    const existing = partners.find((p) => p.id === id);
    if (!existing) return;
    await updatePartner(id, { name: data.name, balance: existing.balance });
    setNameDialogPartner(null);
  };

  const handleMoneySubmit = async (id: string, data: { name: string; balance?: number }) => {
    const existing = partners.find((p) => p.id === id);
    if (!existing) return;
    await updatePartner(id, { name: existing.name, balance: data.balance ?? 0 });
    setMoneyDialogPartner(null);
  };

  const handleDelete = async () => {
    if (!deletingPartner) return;
    await removePartner(deletingPartner.id);
    setDeletingPartner(null);
  };

  return (
    <div data-testid="partners-page-root" className="space-y-6">
      <PageHeader
        title={t.partners.page.title}
        description={t.partners.page.description}
      >
        {/* Search Input */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-note-yellow" />
            <input
              type="text"
              placeholder={t.partners.page.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-11 pr-4 py-2.5 border-2 border-note-yellow/50 rounded-lg bg-white focus:outline-none focus:border-note-yellow focus:ring-1 focus:ring-note-yellow text-ink-black font-medium placeholder:text-pencil-gray/70"
            />
          </div>
          <Button
            className="rounded-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.partners.page.addPartner}
          </Button>
      </PageHeader>

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
            <p className="text-red-600">{t.partners.page.failedLoad.replace("{error}", error)}</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error ? (
        sortedPartners.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedPartners.map((partner) => {
              const receivable = partner.balance > 0;
              const payable = partner.balance < 0;
              const neutral = partner.balance === 0;
              const isDefault = defaultPartnerId === partner.id;
              return (
                <Card key={partner.id} className={`border-note-yellow/25 transition-all duration-200 ${isDefault ? "border-yellow-400 bg-yellow-50/50 shadow-md ring-1 ring-yellow-300" : ""}`}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl ${isDefault ? "bg-yellow-400 text-yellow-900" : "bg-note-yellow/25 text-note-yellow"}`}>
                          {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-3xl font-semibold text-ink-black">{partner.name}</p>
                          {isDefault && (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className={`p-2 rounded-md transition-colors ${
                            defaultPartnerId === partner.id
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-pencil-gray hover:text-note-yellow"
                          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500`}
                          onClick={() => {
                            if (defaultPartnerId === partner.id) {
                              clearDefault();
                            } else {
                              setAsDefault(partner.id);
                            }
                          }}
                            aria-label={defaultPartnerId === partner.id ? t.partners.page.unsetDefault : t.partners.page.setDefault}
                        >
                          <Star className="h-4 w-4" fill={defaultPartnerId === partner.id ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="p-2 inline-flex items-center justify-center rounded-md text-ink-black hover:bg-note-yellow/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                          onClick={() => setNameDialogPartner(partner)}
                          aria-label={t.partners.page.editName.replace("{name}", partner.name)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 inline-flex items-center justify-center rounded-md text-ink-black hover:bg-note-yellow/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                          onClick={() => setMoneyDialogPartner(partner)}
                          aria-label={t.partners.page.editBalance.replace("{name}", partner.name)}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500"
                          onClick={() => setDeletingPartner(partner)}
                          aria-label={t.partners.page.deletePartner.replace("{name}", partner.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-lg font-semibold">
                      {receivable ? <TrendingUp className="h-4 w-4 text-green-500" /> : null}
                      {payable ? <TrendingDown className="h-4 w-4 text-red-500" /> : null}
                      <span className={receivable ? "text-green-600" : payable ? "text-red-600" : "text-pencil-gray"}>
                        {receivable ? t.partners.page.theyOweMe.replace("{amount}", formatVnd(partner.balance)) : null}
                        {payable ? t.partners.page.iOweThem.replace("{amount}", formatVnd(partner.balance)) : null}
                        {neutral ? t.partners.page.noDebt : null}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
                        onClick={() => setRepaymentPartner(partner)}
                        disabled={neutral}
                      >
                        <HandCoins className="mr-1 h-4 w-4" />
                        {t.partners.page.repayDebt}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : searchQuery.trim() && partners.length > 0 ? (
          <Card className="border-note-yellow/30">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-semibold text-ink-black">{t.partners.page.noPartnersFound}</p>
              <p className="text-sm text-pencil-gray">{t.partners.page.noPartnersSearch.replace("{query}", searchQuery)}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-note-yellow/30">
            <CardContent className="p-6 text-center">
              <p className="text-xl font-semibold text-ink-black">{t.partners.page.noPartnersYet}</p>
              <p className="text-sm text-pencil-gray">{t.partners.page.addPartnerHint}</p>
            </CardContent>
          </Card>
        )
      ) : null}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsCreateOpen(false)} />
          <DialogHeader>
            <DialogTitle>{t.partners.page.createPartnerTitle}</DialogTitle>
            <DialogDescription>{t.partners.page.createPartnerDescription}</DialogDescription>
          </DialogHeader>
          <DebtPartnerForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <PartnerNameDialog
        open={nameDialogPartner !== null}
        partner={nameDialogPartner}
        onOpenChange={(open) => {
          if (!open) setNameDialogPartner(null);
        }}
        onSubmit={handleNameSubmit}
      />
      <PartnerMoneyDialog
        open={moneyDialogPartner !== null}
        partner={moneyDialogPartner}
        onOpenChange={(open) => {
          if (!open) setMoneyDialogPartner(null);
        }}
        onSubmit={handleMoneySubmit}
      />
      <PartnerRepaymentDialog
        open={repaymentPartner !== null}
        partner={repaymentPartner}
        onOpenChange={(open) => {
          if (!open) setRepaymentPartner(null);
        }}
      />

      <Dialog open={deletingPartner !== null} onOpenChange={(open) => !open && setDeletingPartner(null)}>
        <DialogContent>
          <DialogClose onClose={() => setDeletingPartner(null)} />
          <DialogHeader>
            <DialogTitle>{t.partners.page.deletePartnerTitle}</DialogTitle>
            <DialogDescription>
              {deletingPartner ? t.partners.page.deletePartnerDescription.replace("{name}", deletingPartner.name) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeletingPartner(null)}>
              {t.partners.page.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t.partners.page.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
