"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#1F2937]">{t.auth.register.title}</h1>
        <p className="text-gray-600 font-quicksand">{t.auth.register.description}</p>
      </div>

      <RegisterForm />

      <div className="text-center text-sm font-quicksand">
        <span className="text-gray-600">{t.auth.register.haveAccount}</span>
        <Link href="/login" className="text-[#1F2937] hover:underline font-semibold">
          {t.auth.register.cta}
        </Link>
      </div>
    </div>
  );
}
