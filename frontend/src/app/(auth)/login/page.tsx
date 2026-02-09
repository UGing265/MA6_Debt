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
        <h1 className="text-3xl font-bold font-patrick text-gray-900">Sign In</h1>
        <p className="text-gray-500 font-quicksand">Welcome back! Sign in to your account.</p>
      </div>
      
      <LoginForm />
      
      <div className="text-center text-sm font-quicksand">
        <span className="text-gray-500">Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#F5D066] hover:underline font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
}
