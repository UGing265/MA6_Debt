import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F2EEDB] py-20 md:py-32">
      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8CB50] bg-[#FEF9E7] px-4 py-1.5 text-sm font-medium text-gray-700">
            <TrendingUp className="h-4 w-4" />
            <span>Smart personal finance</span>
          </div>
          <h1 className="mb-6 text-4xl font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Manage your money
            <span className="block text-[#C8A93C]">
              with clarity and discipline
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Organize physical cash with hierarchical wallets, track debt in real time, and build a stronger monthly money habit.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center rounded-full bg-[#F0D25D] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#E8CB50] hover:shadow-md"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-[#E8CB50] bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-[#FEF9E7]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
