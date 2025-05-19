"use client";
import { requestPasswordResetEmail } from "@/actions/tokens";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "./ui/alert";
export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const handleSendResetPasswordLink = async ({
    email,
  }: z.infer<typeof emailSchema>) => {
    setSuccess(false);
    setMessage("");
    try {
      const response = await requestPasswordResetEmail(email);

      if (response.success) {
        setSuccess(true);
        setMessage(response.message);
        console.log("Client", response);
      } else {
        setSuccess(false);
        setMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSendResetPasswordLink)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription className="hidden">
                Enter the email address associated with your account
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="hover:cursor-pointer"
        >
          {isSubmitting ? (
            <Loader className="animate-spin h-4 w-4" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
}
