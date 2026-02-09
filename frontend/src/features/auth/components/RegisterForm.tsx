"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterSchema, RegisterInput } from "../types/auth";
import { register } from "../api/auth";
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

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema as any),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data);
      toast.success("Account created!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
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
                <Input placeholder="Choose a username" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email (Optional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
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
                <Input type="password" placeholder="Create a password" {...field} className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-200">
          Sign Up
        </Button>
      </form>
    </Form>
  );
};
