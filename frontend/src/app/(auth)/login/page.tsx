import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login - MA6 Debt",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <LoginForm />
    </div>
  );
}
