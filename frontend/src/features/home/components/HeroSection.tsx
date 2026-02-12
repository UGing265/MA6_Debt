import Link from "next/link";
import { Check, Menu } from "lucide-react";

const Navbar = () => (
  <nav className="mx-auto mb-16 flex max-w-5xl items-center justify-between rounded-full border border-[#A69080]/20 bg-white/80 px-6 py-3 backdrop-blur-sm md:mb-24">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00] text-white font-bold shadow-sm">
        M
      </div>
      <span className="font-patrick font-bold text-[#4A3728]">MA6 Debt</span>
    </div>

    <div className="hidden items-center gap-8 md:flex">
      {["Feature", "Pricing", "Discover", "About"].map((item) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className="font-quicksand text-sm font-medium text-[#4A3728] transition-colors hover:text-[#FF7A00]"
        >
          {item}
        </Link>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="font-quicksand hidden rounded-full border border-[#A69080]/50 px-5 py-2 text-sm font-semibold text-[#4A3728] transition-colors hover:bg-[#F5EBE0] sm:inline-flex"
      >
        Log In
      </Link>
      <Link
        href="/register"
        className="font-quicksand rounded-full border border-[#C85A00] bg-[#FF7A00] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#E66E00]"
      >
        Sign Up
      </Link>
      <button className="md:hidden text-[#4A3728]">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  </nav>
);

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F5EBE0] px-4 py-6 md:px-6 lg:px-8">
      <Navbar />

      <div className="container mx-auto max-w-6xl pb-20 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="flex flex-col items-start text-left">
            <h1 className="font-patrick mb-6 text-5xl font-bold leading-tight tracking-tight text-[#4A3728] md:text-6xl lg:text-7xl">
              <span className="text-[#FF7A00]">Track</span> your money, <br />
              made simple
            </h1>
            
            <p className="font-quicksand mb-8 max-w-lg text-lg leading-relaxed text-[#8B7D6B]">
              See where your money goes. No confusing charts. Just the facts.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Link
                href="/register"
                className="font-quicksand inline-flex items-center justify-center rounded-full border border-[#C85A00] bg-[#FF7A00] px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#E66E00] hover:shadow-md"
              >
                Try for Free
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[#A69080]/10">
              <div className="mb-6 flex items-center justify-between border-b border-[#F5EBE0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#F5EBE0] flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full bg-[#FF7A00]" />
                  </div>
                  <div>
                    <div className="h-2.5 w-24 rounded-full bg-[#4A3728]/10 mb-1.5" />
                    <div className="h-2 w-16 rounded-full bg-[#4A3728]/5" />
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#F5EBE0]" />
              </div>

              <div className="space-y-4">
                {[
                  { text: "Track Daily Expenses", amount: "-$45.00" },
                  { text: "Monthly Rent", amount: "-$1,200.00" },
                  { text: "Freelance Income", amount: "+$3,500.00", positive: true },
                  { text: "Savings Goal", amount: "$500.00", highlight: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-[#F5EBE0] p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${item.highlight ? 'bg-[#FF7A00]' : 'bg-[#F5EBE0]'}`}>
                        <Check className={`h-3.5 w-3.5 ${item.highlight ? 'text-white' : 'text-[#4A3728]'}`} />
                      </div>
                      <span className="text-sm font-medium text-[#4A3728]">{item.text}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.positive ? 'text-green-600' : 'text-[#4A3728]'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute -right-4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-2xl bg-[#FF7A00] shadow-lg flex items-center justify-center transform rotate-12">
                 <span className="text-white font-bold text-xl">$</span>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-[#FF7A00]/10 blur-3xl" />
            <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-[#4A3728]/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
