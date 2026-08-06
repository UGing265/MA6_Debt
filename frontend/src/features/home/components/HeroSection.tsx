"use client";

import Link from "next/link";
import { Check, Menu } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supportedLocales } from "@/lib/i18n";

const Navbar = () => {
  const { t } = useLanguage();
  const navLinks = [
    { label: t.home.nav.feature, href: "#features" },
    { label: t.home.nav.pricing, href: "#pricing" },
    { label: t.home.nav.discover, href: "#discover" },
    { label: t.home.nav.about, href: "#about" },
  ];

  return (
    <nav className="mx-auto mb-16 flex max-w-5xl items-center justify-between rounded-full border border-[#1F2937]/10 bg-[#FFFDF5]/90 px-4 py-3 backdrop-blur-sm md:mb-24 md:px-6 font-quicksand">
      <div className="flex items-center gap-3.5">
        <img
          src="/MA6.png"
          alt="MA6 Debt Logo"
          className="h-14 w-14 object-contain shrink-0 transition-transform hover:scale-105"
        />
        <span className="hidden font-bold font-patrick text-[#1F2937] text-2xl sm:inline md:text-2.5xl">MA6 Debt</span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1F2937]"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden rounded-full border border-[#1F2937]/20 px-5 py-2 text-sm font-semibold text-[#1F2937] transition-colors hover:bg-[#FEF3C7] sm:inline-flex"
        >
          {t.home.nav.login}
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-[#FCD34D] px-5 py-2 text-sm font-semibold text-[#1F2937] shadow-sm transition-colors hover:bg-[#FBBF24] border border-[#1F2937]/30"
        >
          {t.home.nav.register}
        </Link>
        <button className="md:hidden text-[#1F2937]">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export const HeroSection = () => {
  const { locale, setLocale, t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFBEB] px-4 py-6 md:px-6 lg:px-8">
      {/* Nút chuyển ngôn ngữ nằm ngoài Navbar ở góc trên bên phải màn hình */}
      <div
        className="absolute top-4 right-4 md:top-5 md:right-6 z-50 flex rounded-full border border-[#1F2937]/15 bg-white/90 p-0.5 shadow-sm backdrop-blur-xs"
        aria-label={t.home.nav.languageLabel}
      >
        {supportedLocales.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`h-6 px-2 rounded-full text-[10px] font-extrabold uppercase transition-all focus-visible:outline-none ${
              locale === item
                ? "bg-[#FCD34D] text-[#1F2937] shadow-xs"
                : "text-[#6B7280] hover:bg-[#FEF3C7] hover:text-[#1F2937]"
            }`}
            aria-pressed={locale === item}
          >
            {item}
          </button>
        ))}
      </div>

      <Navbar />

      <div className="container mx-auto max-w-6xl pb-20 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="flex flex-col items-start text-left">
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-[#1F2937] font-patrick md:text-6xl lg:text-7xl">
              <span className="text-[#D97706]">{t.home.hero.titleLead}</span> {t.home.hero.titleTail}
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#4B5563] font-quicksand">
              {t.home.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#FCD34D] px-8 py-4 text-base font-bold text-[#1F2937] shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#FBBF24] border border-[#1F2937]/30"
              >
                {t.home.hero.cta}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl border border-[#1F2937]/10 bg-white p-6 shadow-xl font-quicksand">
              <div className="mb-6 flex items-center justify-between border-b border-[#1F2937]/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#FCD34D]" />
                  <div className="h-3 w-20 rounded bg-[#1F2937]/10" />
                </div>
                <div className="h-6 w-6 rounded-full bg-[#FEF3C7]" />
              </div>

              <div className="space-y-4">
                {[
                  { title: t.home.hero.stat1, amount: "-$45.00", isNegative: true },
                  { title: t.home.hero.stat2, amount: "-$1,200.00", isNegative: true },
                  { title: t.home.hero.stat3, amount: "+$3,500.00", isNegative: false },
                  { title: t.home.hero.stat4, amount: "$500.00", isNegative: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-[#FFFDF5] p-3 border border-[#1F2937]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706]">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-[#1F2937]">{item.title}</span>
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        item.isNegative ? "text-[#D97706]" : "text-emerald-600"
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCD34D] text-[#1F2937] font-bold shadow-lg border border-[#1F2937]/20">
                $
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
