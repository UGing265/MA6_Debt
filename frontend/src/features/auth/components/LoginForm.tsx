"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema, LoginInput } from "../types/auth";
import { login } from "../api/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema as any),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await login(data);
      localStorage.setItem("token", response.token);
      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-200">
          Sign In
        </Button>
      </form>
    </Form>
  );
};
