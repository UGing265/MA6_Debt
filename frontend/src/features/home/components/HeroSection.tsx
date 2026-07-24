import Link from "next/link";
import { Check, Menu } from "lucide-react";

const Navbar = () => (
  <nav className="mx-auto mb-16 flex max-w-5xl items-center justify-between rounded-full border border-[#1F2937]/10 bg-[#FFFDF5]/90 px-6 py-3 backdrop-blur-sm md:mb-24 font-quicksand">
    <div className="flex items-center gap-2.5">
      <img
        src="/MA6.png"
        alt="MA6 Debt Logo"
        className="h-9 w-9 rounded-xl object-contain shadow-xs bg-white p-0.5 border border-[#1F2937]/20 shrink-0"
      />
      <span className="font-bold font-patrick text-[#1F2937] text-xl">MA6 Debt</span>
    </div>

    <div className="hidden items-center gap-8 md:flex">
      {["Feature", "Pricing", "Discover", "About"].map((item) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1F2937]"
        >
          {item}
        </Link>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden rounded-full border border-[#1F2937]/20 px-5 py-2 text-sm font-semibold text-[#1F2937] transition-colors hover:bg-[#FEF3C7] sm:inline-flex"
      >
        Log In
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-[#FCD34D] px-5 py-2 text-sm font-semibold text-[#1F2937] shadow-sm transition-colors hover:bg-[#FBBF24] border border-[#1F2937]/30"
      >
        Sign Up
      </Link>
      <button className="md:hidden text-[#1F2937]">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  </nav>
);

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFFBEB] px-4 py-6 md:px-6 lg:px-8">
      <Navbar />

      <div className="container mx-auto max-w-6xl pb-20 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="flex flex-col items-start text-left">
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-[#1F2937] font-patrick md:text-6xl lg:text-7xl">
              <span className="text-[#D97706]">Track</span> your money, <br />
              made simple
            </h1>
            
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#4B5563] font-quicksand">
              See where your money goes. No confusing charts. Just the facts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#FCD34D] px-8 py-4 text-base font-bold text-[#1F2937] shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#FBBF24] border border-[#1F2937]/30"
              >
                Try for Free
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
                  { title: "Track Daily Expenses", amount: "-$45.00", isNegative: true },
                  { title: "Monthly Rent", amount: "-$1,200.00", isNegative: true },
                  { title: "Freelance Income", amount: "+$3,500.00", isNegative: false },
                  { title: "Savings Goal", amount: "$500.00", isNegative: false },
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
