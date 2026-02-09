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
        <h1 className="text-3xl font-bold font-patrick text-gray-900">Create Account</h1>
        <p className="text-gray-500 font-quicksand">Join us today! Create your account.</p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center text-sm font-quicksand">
        <span className="text-gray-500">Already have an account? </span>
        <Link href="/login" className="text-[#F5D066] hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
