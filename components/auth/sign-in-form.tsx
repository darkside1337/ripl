"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/lib/schemas";
import SignInWithGoogleButton from "../ui/SignInWithGoogleButton";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { credentialsSignInAction } from "@/actions/authActions";
import { prettifyFlattenedErrors } from "@/lib/helpers";
import { Alert, AlertDescription } from "../ui/alert";
import { useRouter } from "next/navigation";
export default function SignInForm({ className }: { className?: string }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  async function onSubmit({ email, password }: z.infer<typeof SignInSchema>) {
    setSuccess(false);
    setMessage("");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // globalError or errors

    try {
      const response = await credentialsSignInAction(formData);

      if (response?.success) {
        setSuccess(true);
        setMessage(response.message);
        toast.success("Signed in successfully!");

        setTimeout(() => router.replace("/"), 2000);
      } else if (response?.errors) {
        const errors = prettifyFlattenedErrors(response?.errors);
        errors.forEach((error) => {
          form.setError(error.name, {
            type: error.type,
            message: error.message,
          });
        });
      } else {
        setSuccess(false);
        setMessage(response?.globalError || "Something went wrong.");
      }
    } catch (error) {
      console.error("Sign in submission error:", error);
      setSuccess(false);
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your email (e.g., name@example.com)"
                  type="email"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription className="hidden">
                This is your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="relative">
                Password{" "}
                <Link
                  href="/auth/forgot-password"
                  className="absolute right-0 text-xs hover:text-blue-500 px-2 py-4"
                >
                  Forgot Password ?
                </Link>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="******"
                    type={passwordVisible ? "text" : "password"}
                    {...field}
                    autoComplete="off"
                  />
                  <Button
                    variant={"ghost"}
                    className="absolute right-1 top-0 opacity-50 hover:opacity-100 transition-opacity duration-300 hover:text-blue-500 hover:cursor-pointer"
                    type="button"
                    size={"icon"}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <EyeOff size={48} className="" />
                    ) : (
                      <Eye size={48} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="hidden">
                This is your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && (
          <Alert variant={success ? "success" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <Button className="w-full hover:cursor-pointer" type="submit">
          Sign In
        </Button>
        <SignInWithGoogleButton />
      </form>
    </Form>
  );
}
