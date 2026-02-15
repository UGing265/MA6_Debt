"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { WalletsTabContent } from "@/features/workspace/components/WalletsTabContent"
import { DebtPartnersTabContent } from "@/features/workspace/components/DebtPartnersTabContent"

function WorkspaceContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "wallets"

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", newTab)
    window.history.replaceState(null, "", `?${params.toString()}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-patrick)' }}>
          Workspace
        </h1>
        <p className="text-gray-600">Manage your wallets and debt partners</p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="partners">Debt Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets">
          <Suspense fallback={<div className="p-6 text-center">Loading wallets...</div>}>
            <WalletsTabContent />
          </Suspense>
        </TabsContent>

        <TabsContent value="partners">
          <Suspense fallback={<div className="p-6 text-center">Loading debt partners...</div>}>
            <DebtPartnersTabContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <WorkspaceContent />
    </Suspense>
  )
}
