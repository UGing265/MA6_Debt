"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { logout } from "@/features/auth/api/auth";
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
  Eye,
  EyeOff,
  MoreHorizontal,
} from "lucide-react";
import { PrivacyProvider, usePrivacy } from "@/context/PrivacyContext";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  testId?: string;
};

const PrivacyQuickToggle = () => {
  const { hideAmount, tempShow, setTempShow } = usePrivacy();
  const pathname = usePathname();

  // Condition 1: Must be turned on in settings
  if (!hideAmount) return null;

  // Condition 2: Route must be one of the pages containing money
  const moneyRoutes = [
    "/dashboard",
    "/wallets",
    "/partners",
    "/history",
    "/transfer",
    "/quick-deduct",
  ];
  
  const isMoneyPage = moneyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isMoneyPage) return null;

  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setTempShow(true);
  };

  const handleRelease = () => {
    setTempShow(false);
  };

  return (
    <button
      type="button"
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      aria-label="Hold to reveal amounts"
      title="Hold to reveal amounts"
      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-note-yellow/40 bg-white hover:bg-note-yellow/10 text-ink-black transition-colors cursor-pointer select-none active:scale-95 duration-100"
    >
      {tempShow ? (
        <>
          <Eye className="h-4 w-4 text-note-yellow" />
          <span className="hidden sm:inline">Amounts visible</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4 text-pencil-gray" />
          <span className="hidden sm:inline">Hold to view</span>
        </>
      )}
    </button>
  );
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

const DashboardLayoutContent = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  displayName,
  pathname,
  onSignOut,
}: {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  displayName: string;
  pathname: string;
  onSignOut: () => void;
}) => {
  const { hideAmount, tempShow } = usePrivacy();
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMoreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMoreOpen]);

  // Clone element to pass a prop. This updates the element reference, which forces React to re-render in-place without remounting!
  const renderedChildren = React.useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { hideAmount, tempShow });
      }
      return child;
    });
  }, [children, hideAmount, tempShow]);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <aside
        className={`hidden md:flex fixed inset-y-0 left-0 z-30 w-[225px] border-r border-note-yellow/20 bg-white/90 flex-col overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-5 border-b border-note-yellow/20">
          <div className="flex items-center gap-3">
            <Image
              src="/MA6.png"
              alt="MA6 Debt Logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="text-2xl font-bold text-ink-black truncate">MA6 Debt</p>
              <p className="text-sm text-pencil-gray truncate">Hello, {displayName}</p>
            </div>
          </div>
        </div>

        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(pathname, null, item.href);
            const placeholder = isPlaceholderNav(item.href);
            let itemStateClass = "text-ink-black hover:bg-note-yellow/10";
            if (active) {
              itemStateClass = "bg-note-yellow/20 text-[#D97706]";
            } else if (placeholder) {
              itemStateClass = "text-pencil-gray/50 cursor-default";
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                scroll={false}
                data-testid={item.testId}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${itemStateClass}`}
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
            onClick={onSignOut}
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
            className="hidden md:block rounded-md p-1.5 text-ink-black transition-colors hover:bg-note-yellow/20 cursor-pointer"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <PrivacyQuickToggle />
        </header>
        <main className="p-4 pb-28 md:p-6 md:pb-6">{renderedChildren}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-1 left-2 right-2 z-40 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between px-1 h-16">
        {[
          { label: "Home", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { label: "Wallets", href: "/wallets", icon: <Wallet2 className="h-5 w-5" /> },
          { label: "Action", href: "/quick-deduct", icon: <Zap className="h-6 w-6" />, center: true },
          { label: "Partners", href: "/partners", icon: <Users className="h-5 w-5" /> },
          { label: "More", href: "#", icon: <MoreHorizontal className="h-5 w-5" />, isMore: true },
        ].map((item) => {
          if (item.center) {
            return (
              <Link key={item.label} href={item.href} scroll={false} className="relative -top-5 flex flex-col items-center group z-40">
                <div className="h-14 w-14 rounded-full bg-note-yellow text-ink-black flex items-center justify-center shadow-lg border-4 border-[#FFFBEB] transform transition-transform duration-200 group-active:scale-95">
                  {item.icon}
                </div>
              </Link>
            )
          }

          if (item.isMore) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={`flex flex-col items-center justify-center w-[4.5rem] h-full gap-1 transition-colors cursor-pointer ${
                  isMoreOpen ? "text-[#D97706]" : "text-pencil-gray hover:text-ink-black"
                }`}
              >
                <div className={`transition-transform duration-200 ${isMoreOpen ? "-translate-y-0.5" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium leading-none ${isMoreOpen ? "opacity-100" : "opacity-80"}`}>
                  {item.label}
                </span>
              </button>
            )
          }

          const active = isActive(pathname, null, item.href);

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

      {/* Mobile Bottom Sheet Overlay Backdrop */}
      {isMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMoreOpen(false);
          }}
        />
      )}

      {/* Mobile Bottom Sheet Menu container */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#FFFBEB] rounded-t-3xl border-t border-note-yellow/20 shadow-2xl p-6 pb-8 transition-transform duration-300 transform ${
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* Pull handle bar */}
        <div className="mx-auto w-12 h-1.5 bg-pencil-gray/20 rounded-full mb-6" />

        <h3 className="text-lg font-bold text-ink-black mb-4 text-center">Menu</h3>

        <div className="space-y-3">
          {[
            {
              label: "Internal Transfer",
              description: "Transfer money between your wallets",
              href: "/transfer",
              icon: <ArrowLeftRight className="h-5 w-5 text-[#D97706]" />,
            },
            {
              label: "Transaction History",
              description: "View and filter transaction history",
              href: "/history",
              icon: <Clock3 className="h-5 w-5 text-[#D97706]" />,
            },
            {
              label: "User Guide",
              description: "Learn how to use MA6 Debt",
              href: "/help",
              icon: <HelpCircle className="h-5 w-5 text-[#D97706]" />,
            },
            {
              label: "Profile & Settings",
              description: "Manage your profile and privacy settings",
              href: "/profile",
              icon: <Settings className="h-5 w-5 text-[#D97706]" />,
            },
          ].map((item) => {
            const active = isActive(pathname, null, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  active
                    ? "bg-note-yellow/20 border-note-yellow/40 shadow-sm"
                    : "bg-white border-gray-100 hover:bg-note-yellow/5"
                }`}
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-note-yellow/10">
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-ink-black">{item.label}</p>
                  <p className="text-xs text-pencil-gray mt-0.5">{item.description}</p>
                </div>
                <svg
                  className="h-5 w-5 text-pencil-gray/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setIsMoreOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-4 p-4 rounded-2xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors mt-6 cursor-pointer"
          >
            <div className="flex-shrink-0 p-3 rounded-xl bg-red-100/50">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-red-600">Sign Out</p>
              <p className="text-xs text-red-600/70 mt-0.5">Log out from your account</p>
            </div>
          </button>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = React.useState("User");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const handleSignOut = React.useCallback(() => {
    logout()
      .catch(() => undefined)
      .then(() => {
        router.replace("/login");
      });
  }, [router]);

  React.useEffect(() => {
    getProfile().then(data => {
      setDisplayName(data.name || data.username || "User");
    }).catch(() => {
      setDisplayName("User");
    });

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
    <PrivacyProvider>
      <DashboardLayoutContent
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        displayName={displayName}
        pathname={pathname}
        onSignOut={handleSignOut}
      >
        {children}
      </DashboardLayoutContent>
    </PrivacyProvider>
  );
}
