"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { forgotPassword } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      toast.error(t.auth.forgotPassword.inputPlaceholder);
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(emailOrUsername.trim());
      setIsSubmitted(true);
      toast.success(res.message || t.auth.forgotPassword.successMessage);
    } catch (error: any) {
      toast.error(error.message || t.auth.forgotPassword.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#1F2937]">{t.auth.forgotPassword.title}</h1>
        <p className="text-gray-600 font-quicksand text-sm max-w-sm mx-auto">
          {t.auth.forgotPassword.description}
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#FFFDF5] border border-[#1F2937]/10 p-6 rounded-2xl text-center space-y-4 shadow-sm animate-fade-in">
          <div className="flex justify-center">
            <MailCheck className="h-12 w-12 text-emerald-600 animate-bounce" />
          </div>
          <p className="text-sm font-quicksand text-gray-700 leading-relaxed">
            {t.auth.forgotPassword.submittedNotice}
          </p>
          <p className="text-xs text-gray-500 font-quicksand">
            {t.auth.forgotPassword.spamWarning}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-bold text-[#1F2937] hover:underline"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              {t.auth.forgotPassword.backToLogin}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t.auth.forgotPassword.inputLabel}</label>
            <Input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={t.auth.forgotPassword.inputPlaceholder}
              disabled={isLoading}
              className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200 border border-[#1F2937]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.auth.forgotPassword.submitting}
              </>
            ) : (
              t.auth.forgotPassword.submit
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-[#1F2937] transition-colors"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              {t.auth.forgotPassword.backToLogin}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
