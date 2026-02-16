"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import {
  ArrowLeftRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  Wallet2,
  Zap,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  testId?: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/wallets/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    testId: "nav-wallet-dashboard",
  },
  {
    label: "Wallets",
    href: "/wallets",
    icon: <Wallet2 className="h-4 w-4" />,
    testId: "nav-wallets",
  },
  {
    label: "Quick Deduct",
    href: "/workspace?tab=quick-deduct",
    icon: <Zap className="h-4 w-4" />,
    testId: "nav-quick-deduct",
  },
  {
    label: "Partners",
    href: "/partners",
    icon: <Users className="h-4 w-4" />,
    testId: "nav-partners",
  },
  {
    label: "History",
    href: "/workspace?tab=history",
    icon: <Clock3 className="h-4 w-4" />,
    testId: "nav-history",
  },
  {
    label: "Transfer",
    href: "/workspace?tab=transfer",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    testId: "nav-transfer",
  },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0];
  if (cleanHref === "/wallets/dashboard") {
    return pathname === "/wallets/dashboard";
  }
  if (cleanHref === "/wallets") {
    return pathname === "/wallets" || pathname.startsWith("/wallets/");
  }
  if (cleanHref === "/partners") {
    return pathname === "/partners";
  }
  return pathname === cleanHref;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="flex min-h-screen">
        <aside className="w-[250px] border-r border-note-yellow/20 bg-white/90 flex flex-col">
          <div className="px-4 py-5 border-b border-note-yellow/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-note-yellow text-ink-black flex items-center justify-center font-bold">
                G
              </div>
              <div>
                <p className="text-2xl font-bold text-ink-black">MA6 Debt</p>
                <p className="text-sm text-pencil-gray">Hello, user</p>
              </div>
            </div>
          </div>

          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-testid={item.testId}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-note-yellow/20 text-[#D97706]"
                      : "text-ink-black hover:bg-note-yellow/10"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-black hover:bg-note-yellow/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="h-12 border-b border-note-yellow/20 flex items-center px-6">
            <PanelLeft className="h-4 w-4 text-ink-black" />
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
