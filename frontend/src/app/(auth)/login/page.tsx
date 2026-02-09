import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login - MA6 Debt",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#8B6914]">Sign In</h1>
        <p className="text-[#9B8C4F] font-quicksand">Welcome back! Sign in to your account.</p>
      </div>
      
      <LoginForm />
      
      <div className="text-center text-sm font-quicksand">
        <span className="text-[#9B8C4F]">Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#F0D25D] hover:underline font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
}
