import Link from "next/link";
import { Check, Menu } from "lucide-react";

const Navbar = () => (
  <nav className="mx-auto mb-16 flex max-w-5xl items-center justify-between rounded-full border border-[#1F2937]/10 bg-[#FFFDF5]/90 px-6 py-3 backdrop-blur-sm md:mb-24 font-quicksand">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCD34D] text-[#1F2937] font-bold shadow-sm border border-[#1F2937]/20">
        M
      </div>
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
            
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#FCD34D] px-8 py-4 text-base font-semibold text-[#1F2937] shadow-sm transition-all hover:bg-[#FBBF24] hover:shadow-md border border-[#1F2937]/30"
              >
                Try for Free
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-3xl bg-[#FFFDF5] p-6 shadow-xl border border-[#1F2937]/10">
              <div className="mb-6 flex items-center justify-between border-b border-[#FEF3C7] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full bg-[#FCD34D]" />
                  </div>
                  <div>
                    <div className="h-2.5 w-24 rounded-full bg-[#1F2937]/10 mb-1.5" />
                    <div className="h-2 w-16 rounded-full bg-[#1F2937]/5" />
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#FEF3C7]" />
              </div>

              <div className="space-y-4">
                {[
                  { text: "Track Daily Expenses", amount: "-$45.00" },
                  { text: "Monthly Rent", amount: "-$1,200.00" },
                  { text: "Freelance Income", amount: "+$3,500.00", positive: true },
                  { text: "Savings Goal", amount: "$500.00", highlight: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between rounded-xl border p-3 ${item.highlight ? 'border-[#FCD34D]/50 bg-[#FFFBEB]' : 'border-[#1F2937]/10 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${item.highlight ? 'bg-[#FCD34D]' : 'bg-[#FEF3C7]'}`}>
                        <Check className={`h-3.5 w-3.5 ${item.highlight ? 'text-[#1F2937]' : 'text-[#1F2937]'}`} />
                      </div>
                      <span className="text-sm font-medium text-[#1F2937]">{item.text}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.positive ? 'text-green-600' : 'text-[#1F2937]'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute -right-4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-2xl bg-[#FCD34D] shadow-lg flex items-center justify-center transform rotate-12 border-4 border-white">
                 <span className="text-[#1F2937] font-bold text-xl">$</span>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-[#FCD34D]/20 blur-3xl" />
            <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-[#1F2937]/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
