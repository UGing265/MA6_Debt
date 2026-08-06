"use client";


import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { createRegisterSchema, type RegisterInput } from "../types/auth";
import { register } from "../api/auth";
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

const PasswordRequirements = ({ password }: { password: string }) => {
  const { t } = useLanguage();
  const requirements = [
    { label: t.auth.register.requirements.length, met: password.length >= 6 },
    { label: t.auth.register.requirements.uppercase, met: /[A-Z]/.test(password) },
    { label: t.auth.register.requirements.lowercase, met: /[a-z]/.test(password) },
    { label: t.auth.register.requirements.number, met: /[0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 text-sm animate-fade-in grid grid-cols-2 gap-2">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {req.met ? (
            <Check className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <X className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span className={req.met ? "text-green-600 font-bold" : "text-red-500 font-medium"}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await register(data);
      toast.success(t.toast.registerSuccess);
      router.push("/login");
    } catch (error: any) {
      const parsedError = parseErrorResponse(error);
      
      if (parsedError.general) {
        toast.error(parsedError.general);
      }

      // Map field errors to form fields
      const fieldMap: Record<string, keyof RegisterInput> = {
        'Username': 'username',
        'Name': 'name',
        'Email': 'email',
        'Password': 'password',
        // Lowercase fallbacks
        'username': 'username',
        'name': 'name',
        'email': 'email',
        'password': 'password',
      };

      if (parsedError.fields) {
        Object.entries(parsedError.fields).forEach(([key, messages]) => {
          const fieldName = fieldMap[key];
          if (fieldName && messages.length > 0) {
            form.setError(fieldName, { type: 'server', message: messages[0] });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in w-full">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
             <FormItem>
               <FormLabel className="text-gray-700">{t.auth.register.usernameLabel}</FormLabel>
               <FormControl>
                 <Input
                   placeholder={t.auth.register.usernamePlaceholder}
                   {...field}
                   disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] text-[#1F2937] placeholder:text-[#4B5563]/70"
                 />
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
               <FormLabel className="text-gray-700">{t.auth.register.nameLabel}</FormLabel>
               <FormControl>
                 <Input
                   placeholder={t.auth.register.namePlaceholder}
                   {...field}
                   disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] text-[#1F2937] placeholder:text-[#4B5563]/70"
                 />
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
               <FormLabel className="text-gray-700">{t.auth.register.emailLabel}</FormLabel>
               <FormControl>
                 <Input
                   type="email"
                   placeholder={t.auth.register.emailPlaceholder}
                   {...field}
                   disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] text-[#1F2937] placeholder:text-[#4B5563]/70"
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
               <FormLabel className="text-gray-700">{t.auth.register.passwordLabel}</FormLabel>
               <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.register.passwordPlaceholder}
                    {...field}
                    disabled={isLoading}
                    className="bg-[#FFFDF5] border-[#1F2937]/10 focus:border-[#FCD34D] focus:ring-[#FCD34D] pr-10 text-[#1F2937] placeholder:text-[#4B5563]/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    aria-label={showPassword ? t.auth.register.hidePassword : t.auth.register.showPassword}
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
              <FormMessage />
              {field.value && <PasswordRequirements password={field.value} />}
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
              {t.auth.register.submitting}
            </>
          ) : (
            t.auth.register.submit
          )}
        </Button>
      </form>
    </Form>
  );
};
