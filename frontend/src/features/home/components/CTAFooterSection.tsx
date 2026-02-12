import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTAFooterSection = () => {
  return (
    <footer className="border-t border-[#E8CB50] bg-[#FFFBEB] py-12 text-center text-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to take control of your cash?
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Start your disciplined money workflow today with MA6 Debt.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center rounded-full bg-[#F0D25D] px-8 py-3 text-base font-medium text-white transition-all hover:bg-[#E8CB50] focus:outline-none focus:ring-2 focus:ring-[#F0D25D] focus:ring-offset-2"
        >
          Sign In Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <p className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} MA6 Debt. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
