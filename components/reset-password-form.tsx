"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordResetSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "./ui/alert";
import { resetPassword } from "@/actions/tokens";

export default function PasswordResetForm() {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const isSubmitting = form.formState.isSubmitting;
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Password validation criteria
  const hasMinLength = password?.length >= 6 || false;
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasLowerCase = /[a-z]/.test(password || "");
  const hasNumber = /\d/.test(password || "");
  const passwordsMatch = password === confirmPassword && password !== "";
  const router = useRouter();
  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (hasMinLength) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    setPasswordStrength(strength);
  }, [password, hasMinLength, hasUpperCase, hasLowerCase, hasNumber]);

  async function onSubmit({
    password,
    confirmPassword,
  }: z.infer<typeof PasswordResetSchema>) {
    if (!token || !email) {
      setSuccess(false);
      setMessage("Invalid verification link, please try again.");
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password,
        confirmPassword,
      });

      if (response?.success) {
        setSuccess(true);
        setMessage(response.message);

        // redirect after 3 seconds

        setTimeout(() => router.push("/auth/sign-in"), 3000);
      } else {
        setSuccess(false);
        setMessage(response.message);
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Something went wrong, please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  {...field}
                />
              </FormControl>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex w-full gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < passwordStrength
                            ? passwordStrength === 1
                              ? "bg-red-500"
                              : passwordStrength === 2
                                ? "bg-yellow-500"
                                : passwordStrength >= 3
                                  ? "bg-green-600"
                                  : ""
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {passwordStrength === 0 && "Very weak"}
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      {hasMinLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span
                        className={
                          hasMinLength ? "text-green-500" : "text-gray-500"
                        }
                      >
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasUpperCase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span
                        className={
                          hasUpperCase ? "text-green-500" : "text-gray-500"
                        }
                      >
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasLowerCase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span
                        className={
                          hasLowerCase ? "text-green-500" : "text-gray-500"
                        }
                      >
                        At least one lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasNumber ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span
                        className={
                          hasNumber ? "text-green-500" : "text-gray-500"
                        }
                      >
                        At least one number
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  {...field}
                />
              </FormControl>

              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-red-500">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {message && (
          <Alert variant={success ? "success" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
