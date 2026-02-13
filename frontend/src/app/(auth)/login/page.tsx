<<<<<<< HEAD
import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login - MA6 Debt",
};

=======
import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login - MA6 Debt",
};

>>>>>>> b4b5b1f7653a4777b80ffdeeddfd39317ca23613
export default function LoginPage() {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="text-center space-y-2">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold font-patrick text-[#8B6914]">Sign In</h1>
        <p className="text-[#9B8C4F] font-quicksand">Welcome back! Sign in to your account.</p>
=======
        <h1 className="text-3xl font-bold text-[#4A2C2A]">Sign In</h1>
        <p className="text-[#8D6E63]">Welcome back! Sign in to your account.</p>
>>>>>>> b4b5b1f7653a4777b80ffdeeddfd39317ca23613
      </div>
      
      <LoginForm />
      
<<<<<<< HEAD
      <div className="text-center text-sm font-quicksand">
        <span className="text-[#9B8C4F]">Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#F0D25D] hover:underline font-semibold">
=======
      <div className="text-center text-sm">
        <span className="text-[#8D6E63]">Don&apos;t have an account? </span>
        <Link href="/register" className="text-[#FF7A00] hover:underline font-semibold">
>>>>>>> b4b5b1f7653a4777b80ffdeeddfd39317ca23613
          Register
        </Link>
      </div>
    </div>
  );
}
