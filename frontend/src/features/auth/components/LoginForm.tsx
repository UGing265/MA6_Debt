"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LoginSchema, LoginInput } from "../types/auth";
import { login } from "../api/auth";
import { parseErrorResponse } from "../utils/errorParser";
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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema as any),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      localStorage.setItem("token", response.token);
      toast.success("Welcome!");
      router.push("/dashboard");
    } catch (error: any) {
      const parsedError = parseErrorResponse(error);
      
      if (parsedError.general) {
        toast.error(parsedError.general);
      }

      if (parsedError.fields) {
        Object.entries(parsedError.fields).forEach(([field, messages]) => {
          // Map parsed field names back to form field names
          // The parser returns capitalized names like "Password"
          const fieldName = field.toLowerCase();
          if (fieldName === "username" || fieldName === "password") {
            form.setError(fieldName as keyof LoginInput, {
              type: "manual",
              message: messages[0],
            });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your username" 
                  {...field} 
                  disabled={isLoading}
                  className="bg-white/50 border-gray-300 focus:border-[#F5D066] focus:ring-[#F5D066]" 
                />
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
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...field} 
                  disabled={isLoading}
                  className="bg-white/50 border-gray-300 focus:border-[#F5D066] focus:ring-[#F5D066]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#F5D066] hover:bg-[#E5C056] text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
};
