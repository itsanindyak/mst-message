import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "Username must be atleast 5 characters.")
  .max(15, "Username must be no more than 15 characters.")
  .regex(
    /^[a-z0-9]+$/,
    "Username must not contain special and upper case characters"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
