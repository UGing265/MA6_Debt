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
    <div className="max-w-6xl mx-auto font-quicksand">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-2 font-patrick lowercase">
          workspace
        </h1>
        <p className="text-[#4B5563]">manage your wallets and debt partners</p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="font-quicksand">
          <TabsTrigger value="wallets" className="lowercase">wallets</TabsTrigger>
          <TabsTrigger value="partners" className="lowercase">debt partners</TabsTrigger>
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
