"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#1F2937]">{t.auth.login.title}</h1>
        <p className="text-gray-600 font-quicksand">{t.auth.login.description}</p>
      </div>

      <LoginForm />

      <div className="text-center text-sm font-quicksand">
        <span className="text-gray-600">{t.auth.login.noAccount}</span>
        <Link href="/register" className="text-[#1F2937] hover:underline font-semibold">
          {t.auth.login.cta}
        </Link>
      </div>
    </div>
  );
}
