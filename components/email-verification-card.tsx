"use client";

import { useRouter } from "next/navigation";
import MaxWidthWrapper from "./max-width-wrapper";
import SpinnerSVG from "./SVGs/SpinnerSVG";
import { P } from "./typography";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { requestEmailVerification, verifyEmail } from "@/actions/tokens";
import { emailSchema } from "@/lib/schemas";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const GreenSuccessAnimation = dynamic(
  () => import("./animations/green-success-animation"),
  {
    ssr: false,
  }
);

const RedFailAnimation = dynamic(
  () => import("./animations/red-fail-animation"),
  {
    ssr: false,
  }
);

const COOLDOWN_TIME = 60;

export default function EmailVerificationCard() {
  // client component
  // gets token from url
  // verifies token on load
  // if token is valid, show success message
  // if token is invalid, show error message
  // if token is expired, show expired message
  // has a button to resend email
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, email] = [searchParams.get("token"), searchParams.get("email")];

  // ACTUAL VERIFY, RESEND EMAIL LOGIC

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    setGlobalError(null);

    const isValidEmail = emailSchema.safeParse({ email: email }).success;

    if (!isValidEmail || !email) {
      setSuccess(false);
      setGlobalError("Invalid email");
      setIsLoading(false);
      return;
    }

    const response = await requestEmailVerification(email);

    if (response.success) {
      toast.success("Email sent successfully!", {
        duration: 2000,
      });
      setCooldownRemaining(COOLDOWN_TIME);
      setSuccess(true);
    } else {
      setSuccess(false);
      setGlobalError(response.message);
    }
    setIsLoading(false);
  };

  const handleVerifyEmail = async () => {
    if (!token) {
      setSuccess(false);
      setGlobalError("No token found");
      return;
    }

    setIsLoading(true);

    const response = await verifyEmail(token);

    if (response.success) {
      setSuccess(true);
      // redirect to home page after 2 seconds

      toast.success("Email verified successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setSuccess(false);
      setGlobalError(response.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }
  }, [cooldownRemaining]);

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    }
  }, [token]);

  return (
    <MaxWidthWrapper className="grid place-content-center h-full">
      <Card className="w-full sm:w-[400px] lg:w-[500px] text-center min-h-[380px] shadow-md mx-auto">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {isLoading && <p>Verifying token...</p>}
            {success && !isLoading && (
              <p>Successfully verified your email address</p>
            )}
            {!success && !isLoading && <p>Failed to verify token!</p>}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-6 h-full justify-center ">
          {isLoading && (
            <>
              <div className="flex justify-center">
                <SpinnerSVG className="h-32 w-32 animate-spin text-primary" />
              </div>
              <p className="mt-4">This will only take a moment</p>
            </>
          )}
          {success && !isLoading && (
            <>
              <GreenSuccessAnimation className="size-30 mx-auto" />
              <P className="text-green-600">
                {email} has been verified successfully
              </P>
              <div className="flex flex-col gap-4">
                <Button onClick={() => router.push("/")}>Go to feed</Button>
              </div>
            </>
          )}
          {!success && !isLoading && (
            <>
              <div className="flex justify-center">
                <RedFailAnimation className="h-24 w-24 animate-pulse" />
              </div>
              <div className="flex flex-col gap-4">
                <P className="text-destructive">
                  Token verification failed, Please try again
                </P>
                {globalError && (
                  <P className="text-destructive text-sm">{globalError}</P>
                )}
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isLoading || cooldownRemaining > 0}
                >
                  {cooldownRemaining > 0
                    ? `Resend available in ${cooldownRemaining} seconds`
                    : "Send another token"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
