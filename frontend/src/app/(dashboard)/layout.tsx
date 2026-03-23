"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "sonner";
import { getAuthToken, clearAuthToken } from "@/lib/authToken";
import { getProfile } from "@/features/user/api/userApi";
import {
  ArrowLeftRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  Users,
  Wallet2,
  Zap,
  HelpCircle,
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
    label: "Quick Deduct",
    href: "/quick-deduct",
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
    href: "/history",
    icon: <Clock3 className="h-4 w-4" />,
    testId: "nav-history",
  },
  {
    label: "Transfer",
    href: "/transfer",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    testId: "nav-transfer",
  },
  {
    label: "User Guide",
    href: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
    testId: "nav-help",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <Settings className="h-4 w-4" />,
    testId: "nav-profile",
  },
];

const placeholderTabs = new Set(["quick-deduct"]);

function isPlaceholderNav(href: string) {
  if (!href.includes("/workspace?tab=")) return false;
  const tab = new URLSearchParams(href.split("?")[1]).get("tab");
  return tab ? placeholderTabs.has(tab) : false;
}

function isActive(pathname: string, searchTab: string | null, href: string) {
  const cleanHref = href.split("?")[0];
  const targetTab = href.includes("?") ? new URLSearchParams(href.split("?")[1]).get("tab") : null;

  if (cleanHref === "/workspace" && targetTab) {
    return pathname === "/workspace" && searchTab === targetTab;
  }
  if (cleanHref === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/wallets/dashboard";
  }
  if (cleanHref === "/wallets") {
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
  if (cleanHref === "/partners") {
    return pathname === "/partners";
  }
  return pathname === cleanHref;
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
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const [displayName, setDisplayName] = React.useState("User");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const token = getAuthToken();
    setDisplayName(getDisplayNameFromToken(token));

    getProfile().then(data => {
      if (data?.username) setDisplayName(data.username);
    }).catch(console.error);

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.username) {
        setDisplayName(customEvent.detail.username);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <aside
        className={`hidden md:flex fixed inset-y-0 left-0 z-30 w-[225px] border-r border-note-yellow/20 bg-white/90 flex-col overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
            const active = isActive(pathname, currentTab, item.href);
            const placeholder = isPlaceholderNav(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                scroll={false}
                data-testid={item.testId}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-note-yellow/20 text-[#D97706]"
                    : placeholder
                      ? "text-pencil-gray/50 cursor-default"
                      : "text-ink-black hover:bg-note-yellow/10"
                }`}
              >
                {item.icon}
                {item.label}
                {placeholder ? (
                  <span className="ml-auto text-[10px] rounded-full bg-pencil-gray/10 px-1.5 py-0.5 text-pencil-gray/60">Soon</span>
                ) : null}
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

      <div className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-[225px]" : "ml-0"}`}>
        <header className="sticky top-0 z-20 h-14 border-b border-note-yellow/20 bg-[#FFFBEB]/95 backdrop-blur flex items-center px-4 md:px-6 justify-between md:justify-start">
          <div className="flex md:hidden items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-note-yellow text-ink-black flex items-center justify-center font-bold text-sm">
              G
            </div>
            <span className="font-bold text-ink-black text-lg">MA6 Debt</span>
          </div>
          <button
            type="button"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="hidden md:block rounded-md p-1.5 text-ink-black transition-colors hover:bg-note-yellow/20"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </header>
        <main className="p-4 pb-28 md:p-6 md:pb-6">{children}</main>
      </div>
      

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-1 left-2 right-2 z-50 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between px-1 h-16">
        {[
          { label: "Home", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { label: "History", href: "/history", icon: <Clock3 className="h-5 w-5" /> },
          { label: "Action", href: "/quick-deduct", icon: <Zap className="h-6 w-6" />, center: true },
          { label: "Partners", href: "/partners", icon: <Users className="h-5 w-5" /> },
          { label: "Profile", href: "/profile", icon: <Settings className="h-5 w-5" /> },
        ].map((item) => {
          const active = isActive(pathname, currentTab, item.href);
          
          if (item.center) {
            return (
              <Link key={item.label} href={item.href} scroll={false} className="relative -top-5 flex flex-col items-center group z-50">
                <div className="h-14 w-14 rounded-full bg-note-yellow text-ink-black flex items-center justify-center shadow-lg border-4 border-[#FFFBEB] transform transition-transform duration-200 group-active:scale-95">
                  {item.icon}
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              scroll={false}
              className={`flex flex-col items-center justify-center w-[4.5rem] h-full gap-1 transition-colors ${
                active ? "text-[#D97706]" : "text-pencil-gray hover:text-ink-black"
              }`}
            >
              <div className={`transition-transform duration-200 ${active ? "-translate-y-0.5" : ""}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? "opacity-100" : "opacity-80"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Toaster />
    </div>
  );
}
