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
      <nav className="mx-auto mb-8 flex max-w-6xl items-center justify-between rounded-full border border-[#1F2937]/10 bg-[#FFFDF5]/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCD34D] text-[#1F2937] font-bold shadow-sm border border-[#1F2937]/20">
            M
          </div>
          <span className="font-bold font-patrick text-[#1F2937] text-xl">MA6 Debt</span>
        </div>
        <div className="text-sm font-medium text-[#4B5563] lowercase">workspace</div>
      </nav>

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
