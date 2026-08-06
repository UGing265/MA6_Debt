"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { resetPassword } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <div className="bg-[#FFFDF5] border border-amber-200 p-6 rounded-2xl text-center space-y-4 shadow-sm animate-fade-in">
        <div className="flex justify-center">
          <AlertCircle className="h-10 w-10 text-amber-500" />
        </div>
        <p className="text-sm font-quicksand text-gray-700 font-medium">
          {t.auth.resetPassword.invalidToken}
        </p>
        <div>
          <Link
            href="/login"
            className="inline-block text-xs font-bold text-[#1F2937] hover:underline"
          >
            {t.auth.forgotPassword.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(t.auth.resetPassword.minPasswordLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t.auth.resetPassword.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(token, newPassword);
      setIsSuccess(true);
      toast.success(res.message || t.auth.resetPassword.success);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error: any) {
      toast.error(error.message || t.auth.resetPassword.resetFailed);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#FFFDF5] border border-emerald-200 p-6 rounded-2xl text-center space-y-4 shadow-sm animate-fade-in">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold font-patrick text-[#1F2937]">{t.auth.resetPassword.success}</h2>
        <p className="text-sm font-quicksand text-gray-600">
          {t.auth.resetPassword.redirecting}
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold py-2 px-6 rounded-full text-xs shadow transition-colors"
          >
            {t.auth.resetPassword.loginNow}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{t.auth.resetPassword.newPasswordLabel}</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t.auth.resetPassword.newPasswordPlaceholder}
            disabled={isLoading}
            className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] pr-10 text-[#1F2937]"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{t.auth.resetPassword.confirmPasswordLabel}</label>
        <Input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t.auth.resetPassword.confirmPasswordPlaceholder}
          disabled={isLoading}
          className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
          required
          minLength={6}
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
            {t.auth.resetPassword.submitting}
          </>
        ) : (
          t.auth.resetPassword.submit
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#1F2937]">{t.auth.resetPassword.title}</h1>
        <p className="text-gray-600 font-quicksand text-sm max-w-sm mx-auto">
          {t.auth.resetPassword.description}
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-6 text-sm text-gray-500 font-quicksand">{t.common.loading}</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
