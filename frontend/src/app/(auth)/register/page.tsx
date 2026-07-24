import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register - MA6 Debt",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2 flex flex-col items-center">
        <img
          src="/MA6.png"
          alt="MA6 Debt Logo"
          className="h-14 w-14 rounded-2xl object-contain shadow-md bg-white p-1 border-2 border-note-yellow/50 mb-1"
        />
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
