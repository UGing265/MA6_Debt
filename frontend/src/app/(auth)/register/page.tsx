import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register - MA6 Debt",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <RegisterForm />
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
}
