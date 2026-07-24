import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register - MA6 Debt",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-patrick text-[#1F2937]">Create Account</h1>
        <p className="text-gray-600 font-quicksand">Get started with MA6 Debt today.</p>
      </div>

      <RegisterForm />

      <div className="text-center text-sm font-quicksand">
        <span className="text-gray-600">Already have an account? </span>
        <Link href="/login" className="text-[#1F2937] hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
