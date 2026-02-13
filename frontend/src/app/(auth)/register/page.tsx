<<<<<<< HEAD
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
        <h1 className="text-3xl font-bold font-patrick text-[#8B6914]">Create Account</h1>
        <p className="text-[#9B8C4F] font-quicksand">Join us today! Create your account.</p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center text-sm font-quicksand">
        <span className="text-[#9B8C4F]">Already have an account? </span>
        <Link href="/login" className="text-[#F0D25D] hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
=======
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
         <h1 className="text-3xl font-bold text-[#4A2C2A]">Create Account</h1>
         <p className="text-[#8D6E63]">Join us today! Create your account.</p>
       </div>
      
      <RegisterForm />
      
      <div className="text-center text-sm">
         <span className="text-[#8D6E63]">Already have an account? </span>
         <Link href="/login" className="text-[#FF7A00] hover:underline font-semibold">
           Sign in
         </Link>
       </div>
    </div>
  );
}
>>>>>>> b4b5b1f7653a4777b80ffdeeddfd39317ca23613
