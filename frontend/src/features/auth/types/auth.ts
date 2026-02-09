import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().optional().refine(val => !val || z.string().email().safeParse(val).success, {
    message: "Invalid email address"
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    email?: string;
  };
}
