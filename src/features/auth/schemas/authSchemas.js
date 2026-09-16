// src/features/auth/schemas/authSchemas.js

import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one English letter")
  .regex(/[0-9]/, "Password must contain at least one number");
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    full_name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
