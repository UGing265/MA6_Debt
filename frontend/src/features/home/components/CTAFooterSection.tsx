import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTAFooterSection = () => {
  return (
    <footer className="bg-[#FFF7ED] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-white px-6 py-24 text-center shadow-sm sm:rounded-3xl sm:px-16 border border-[#FED7AA]">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#7C2D12] sm:text-4xl">
            Ready to take control of your cash?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#9A3412]">
            Start your disciplined money workflow today with MA6 Debt.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#EA580C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
            >
              Sign In Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-sm leading-5 text-[#9A3412]">
            © {new Date().getFullYear()} MA6 Debt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
