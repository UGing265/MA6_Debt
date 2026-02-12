import Link from "next/link";
import { ArrowRight, TrendingUp, Menu } from "lucide-react";

const Navbar = () => (
  <nav className="mx-auto mb-12 flex max-w-6xl items-center justify-between rounded-full border border-[#E8CB50]/30 bg-[#FFFEF5]/80 px-6 py-3 shadow-sm backdrop-blur-sm md:mb-20">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0D25D] text-white font-bold shadow-sm">
        M
      </div>
      <span className="font-bold text-[#8B6914]">MA6 Debt</span>
    </div>

    <div className="hidden items-center gap-8 md:flex">
      {["Feature", "Pricing", "Discover", "About"].map((item) => (
        <Link
          key={item}
          href={`#${item.toLowerCase()}`}
          className="text-sm font-medium text-[#9B8C4F] transition-colors hover:text-[#8B6914]"
        >
          {item}
        </Link>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden rounded-full border border-[#E8CB50] px-5 py-2 text-sm font-semibold text-[#8B6914] transition-colors hover:bg-[#FFFBEB] sm:inline-flex"
      >
        Log In
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-[#F0D25D] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#E8CB50]"
      >
        Sign Up
      </Link>
      <button className="md:hidden text-[#8B6914]">
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8CB50] bg-[#FFFEF5] px-4 py-1.5 text-sm font-medium text-[#8B6914] shadow-sm">
              <TrendingUp className="h-4 w-4 text-[#F0D25D]" />
              <span>Smart personal finance</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[#8B6914] md:text-5xl lg:text-6xl">
              Manage your money <br />
              <span className="text-[#F0D25D]">with clarity</span>
            </h1>
            
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#9B8C4F]">
              Organize physical cash with hierarchical wallets, track debt in real time, and build a stronger monthly money habit.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center rounded-full bg-[#F0D25D] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E8CB50] hover:shadow-md"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-[#E8CB50] bg-[#FFFEF5] px-8 py-3.5 text-sm font-semibold text-[#8B6914] transition-all hover:bg-[#FFFBEB]"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-[#E8CB50] bg-[#FFFEF5] shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <div className="h-64 w-64 rounded-full bg-[#F0D25D] blur-3xl" />
              </div>
              <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
                 <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFFBEB] shadow-sm ring-1 ring-[#E8CB50]/50">
                    <TrendingUp className="h-10 w-10 text-[#F0D25D]" />
                 </div>
                 <h3 className="text-xl font-bold text-[#8B6914]">Visual Clarity</h3>
                 <p className="mt-2 text-[#9B8C4F]">See your financial health at a glance.</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl bg-[#F0D25D]/10" />
          </div>
        </div>
      </div>
    </section>
  );
};
