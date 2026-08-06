"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createLoginSchema, type LoginInput } from "../types/auth";
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
import { useLanguage } from "@/context/LanguageContext";

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success(t.toast.loginSuccess);
      router.push("/dashboard");
    } catch (error: unknown) {
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
              <FormLabel className="text-gray-700">{t.auth.login.usernameLabel}</FormLabel>
              <FormControl>
                 <Input
                   placeholder={t.auth.login.usernamePlaceholder}
                   {...field}
                   disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D]"
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
              <FormLabel className="text-gray-700">{t.auth.login.passwordLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.login.passwordPlaceholder}
                    {...field}
                    disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] pr-10 text-[#1F2937] placeholder:text-[#4B5563]/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={showPassword ? t.auth.login.hidePassword : t.auth.login.showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD34D] rounded p-1 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  {t.auth.forgotPassword.title}
                </Link>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FCD34D] hover:bg-[#FBBF24] text-[#1F2937] font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200 border border-[#1F2937]/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.auth.login.submitting}
            </>
          ) : (
            t.auth.login.submit
          )}
        </Button>
      </form>
    </Form>
  );
};
