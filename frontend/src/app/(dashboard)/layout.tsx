"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { getAuthToken, clearAuthToken } from "@/lib/authToken";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Users,
  Wallet2,
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
    href: "/dashboard",
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
    label: "Partners",
    href: "/partners",
    icon: <Users className="h-4 w-4" />,
    testId: "nav-partners",
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/wallets/dashboard";
  }
  if (href === "/wallets") {
    if (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/wallets/dashboard" ||
      pathname.startsWith("/wallets/dashboard/")
    ) {
      return false;
    }
    return pathname === "/wallets" || pathname.startsWith("/wallets/");
  }
  if (href === "/partners") {
    return pathname === "/partners";
  }
  return pathname === href;
}

function getDisplayNameFromToken(token: string | null): string {
  if (!token) return "User";

  try {
    const parts = token.split(".");
    if (parts.length < 2) return "User";

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as Record<string, string>;

    const name = payload.name || payload.unique_name || payload.username;
    if (name && name.trim().length > 0) return name;

    const email = payload.email;
    if (email && email.includes("@")) return email.split("@")[0];
  } catch {
    return "User";
  }

  return "User";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = React.useState("User");

  React.useEffect(() => {
    const token = getAuthToken();
    setDisplayName(getDisplayNameFromToken(token));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <aside className="fixed inset-y-0 left-0 z-30 w-[225px] border-r border-note-yellow/20 bg-white/90 flex flex-col overflow-y-auto">
        <div className="px-4 py-5 border-b border-note-yellow/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-note-yellow text-ink-black flex items-center justify-center font-bold">
              G
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-black">MA6 Debt</p>
              <p className="text-sm text-pencil-gray">Hello, {displayName}</p>
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
                scroll={false}
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
            onClick={() => {
              clearAuthToken();
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-black hover:bg-note-yellow/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="ml-[225px] min-h-screen">
        <header className="sticky top-0 z-20 h-12 border-b border-note-yellow/20 bg-[#FFFBEB]/95 backdrop-blur flex items-center px-6">
          <PanelLeft className="h-4 w-4 text-ink-black" />
        </header>
        <main className="p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
