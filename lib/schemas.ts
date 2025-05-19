import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(3),
});

export const anySchema = z.any().optional();

export const emailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const SignUpSchema = z
  .object({
    fullName: z.string().trim().min(3).max(255),
    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9_.-]{2,29}$/,
        "Username can only contain letters, numbers, underscores, periods, or hyphens after the first character."
      )
      .max(30, "Username must be at most 30 characters long"),
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
