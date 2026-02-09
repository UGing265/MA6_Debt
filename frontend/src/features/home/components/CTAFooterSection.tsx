import Link from "next/link";

export const CTAFooterSection = () => {
  return (
    <footer className="bg-slate-900 py-12 text-center text-white border-t border-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-3xl font-bold">
          Sẵn sàng kiểm soát tài chính của bạn?
        </h2>
        <p className="mb-8 text-lg text-slate-400">
          Bắt đầu hành trình tự do tài chính ngay hôm nay.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-base font-medium text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Đăng nhập ngay
        </Link>
        <p className="mt-8 text-sm text-slate-500">
          © {new Date().getFullYear()} MA6 Debt. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
