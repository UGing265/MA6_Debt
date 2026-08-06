"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftRight, Clock3, LayoutDashboard, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useLanguage } from "@/context/LanguageContext";

const tabMap: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  "quick-deduct": {
    title: "Quick Deduct",
    description: "This section is reserved and intentionally left unchanged.",
    icon: <Zap className="h-5 w-5 text-note-yellow" />,
  },
  history: {
    title: "History",
    description: "This section is reserved and intentionally left unchanged.",
    icon: <Clock3 className="h-5 w-5 text-note-yellow" />,
  },
  transfer: {
    title: "Transfer",
    description: "This section is reserved and intentionally left unchanged.",
    icon: <ArrowLeftRight className="h-5 w-5 text-note-yellow" />,
  },
};

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="space-y-6 max-w-4xl"><WorkspaceLoading /></div>}>
      <WorkspacePageContent />
    </Suspense>
  );
}

function WorkspaceLoading() {
  const { t } = useLanguage();

  return <PageHeader title={t.dashboard.workspace.title} description={t.dashboard.workspace.loading} className="mb-0 pb-3" />;
}

function WorkspacePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const tab = searchParams.get("tab") ?? "";

  // Hand off to dedicated route for quick deductions to avoid placeholder UI on workspace
  useEffect(() => {
    if (tab === "quick-deduct") {
      router.replace("/quick-deduct");
    }
  }, [tab, router]);

  // Avoid rendering the placeholder card during redirect
  if (tab === "quick-deduct") {
    return null;
  }

  const current = tabMap[tab];

  // Legacy compatibility: redirect legacy history tab to the dedicated /history experience
  if (tab === "history") {
    router.replace("/history");
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title={t.dashboard.workspace.title} description={t.dashboard.workspace.compatibility} className="mb-0 pb-3" />

      {current ? (
        <Card className="border-note-yellow/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ink-black">
              {current.icon}
              {current.title}
            </CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-pencil-gray">{t.dashboard.workspace.noAdditionalLogic}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-note-yellow/30">
          <CardHeader>
            <CardTitle className="text-ink-black">{t.dashboard.workspace.movedTitle}</CardTitle>
            <CardDescription>{t.dashboard.workspace.movedDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="bg-note-yellow text-ink-black hover:bg-note-yellow/90">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {t.dashboard.workspace.dashboardButton}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
