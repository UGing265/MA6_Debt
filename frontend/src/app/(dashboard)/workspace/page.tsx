"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftRight, Clock3, LayoutDashboard, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

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
    <Suspense fallback={<div className="space-y-6 max-w-4xl"><PageHeader title="Workspace" description="Loading workspace..." className="mb-0 pb-3" /></div>}>
      <WorkspacePageContent />
    </Suspense>
  );
}

function WorkspacePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <PageHeader title="Workspace" description="This route is kept for compatibility." className="mb-0 pb-3" />

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
            <p className="text-sm text-pencil-gray">No additional logic is implemented on this page.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-note-yellow/30">
          <CardHeader>
            <CardTitle className="text-ink-black">Workspace Moved</CardTitle>
            <CardDescription>
              Main wallet and partner management now live on dedicated pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="bg-note-yellow text-ink-black hover:bg-note-yellow/90">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
