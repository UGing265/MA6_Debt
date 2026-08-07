import { z } from "zod";
import { dictionaries, defaultLocale, type I18nDictionary } from "@/lib/i18n";

const defaultT: I18nDictionary = dictionaries[defaultLocale];

export const createLoginSchema = (t: I18nDictionary = defaultT) =>
  z.object({
    username: z.string().min(3, t.validation.usernameMin3),
    password: z.string().min(6, t.validation.passwordMin6),
  });

export const LoginSchema = createLoginSchema();

export type LoginInput = z.infer<typeof LoginSchema>;

export const createRegisterSchema = (t: I18nDictionary = defaultT) =>
  z.object({
    username: z.string().min(3, t.validation.usernameMin3),
    name: z.string().min(3, t.validation.nameRequired),
    email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
      message: t.validation.emailInvalid,
    }),
    password: z
      .string()
      .min(6, t.validation.passwordMin6)
      .regex(/[A-Z]/, t.validation.passwordUppercase)
      .regex(/[a-z]/, t.validation.passwordLowercase)
      .regex(/\d/, t.validation.passwordDigit),
  });

export const RegisterSchema = createRegisterSchema();

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface LoginResponse {
  token?: string;
  expiration?: string;
  refreshToken?: string;
}
