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
        <h1 className="text-3xl font-bold text-[#4A2C2A]">Sign In</h1>
        <p className="text-[#8D6E63]">Welcome back! Sign in to your account.</p>
      </div>
      
      <LoginForm />
      
      <div className="text-center text-sm">
        <span className="text-[#8D6E63]">Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#FF7A00] hover:underline font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
}
