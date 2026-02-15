import React from "react";
import { Toaster } from "sonner";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFBEB" }}>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-amber-900">MA6 Dashboard</div>
            <div className="flex gap-6">
              <Link
                href="/wallets/dashboard"
                className="text-amber-700 hover:text-amber-900 font-medium"
                data-testid="nav-wallet-dashboard"
              >
                Dashboard
              </Link>
              <Link
                href="/wallets"
                className="text-amber-700 hover:text-amber-900 font-medium"
                data-testid="nav-wallets"
              >
                Wallets
              </Link>
              <Link
                href="/partners"
                className="text-amber-700 hover:text-amber-900 font-medium"
                data-testid="nav-partners"
              >
                Partners
              </Link>
              <Link href="/workspace" className="text-amber-700 hover:text-amber-900 font-medium">
                Workspace
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="p-6">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
