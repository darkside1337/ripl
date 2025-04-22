"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { SignUpSchema } from "@/lib/schemas";
import { crendentialsSignUpAction } from "@/actions/authActions";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { prettifyFlattenedErrors } from "@/lib/helpers";
import { AlertDestructive } from "../ui/alert-destructive";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [globalError, setGlobalError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    setError,
    formState: { isSubmitting },
  } = form;

  async function handleSubmit({
    fullName,
    userName,
    email,
    password,
    confirmPassword,
  }: z.infer<typeof SignUpSchema>) {
    // create formData
    const formData = new FormData();
    // append form data
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    // send data to server

    try {
      setGlobalError("");
      const response = await crendentialsSignUpAction(formData);

      if (!response?.success) {
        const errors = prettifyFlattenedErrors(response?.errors);

        errors.forEach((error) => {
          setError(error.name, {
            type: error.type,
            message: error.message,
          });
        });
      } else if (response.globalError) {
        setGlobalError(response.globalError);
      } else {
        toast("Account created successfully");

        // redirect after 3 seconds

        toast(response.message, {
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        {globalError && <AlertDestructive message={globalError} />}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" type="text" {...field} />
              </FormControl>
              <FormDescription className="hidden">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose a unique username"
                  type="text"
                  {...field}
                  autoComplete="username"
                />
              </FormControl>
              <FormDescription className="hidden">
                This is your username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Create a strong password"
                    type={passwordVisible ? "text" : "password"}
                    {...field}
                    autoComplete="new-password"
                  />
                  <Button
                    variant={"ghost"}
                    className="absolute right-1 top-0 opacity-50 hover:opacity-100 transition-opacity duration-300"
                    type="button"
                    size={"icon"}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <EyeOff size={48} /> : <Eye size={48} />}
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Re-enter your password"
                    type={passwordVisible ? "text" : "password"}
                    {...field}
                    autoComplete="new-password"
                  />
                  <Button
                    variant={"ghost"}
                    className="absolute right-1 top-0 opacity-50 hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer"
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
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
