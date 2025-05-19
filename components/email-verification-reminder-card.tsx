"use client";
import dynamic from "next/dynamic";
import { emailSchema } from "@/lib/schemas";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { requestEmailVerification } from "@/actions/tokens";

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

const EmailFailAnimation = dynamic(
  () => import("./animations/email-fail-animation"),
  {
    ssr: false,
  }
);
const EmailSuccessAnimation = dynamic(
  () => import("./animations/email-success-animation"),
  {
    ssr: false,
  }
);

const COOLDOWN_TIME = 60; // in seconds

const EmailVerificationReminderCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const targetEmail = decodeURIComponent(useSearchParams().get("email") || "");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

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
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cooldownRemaining]);

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    setGlobalError(null);

    const isValidEmail = emailSchema.safeParse({ email: targetEmail }).success;

    if (!isValidEmail || !targetEmail) {
      setSuccess(false);
      setGlobalError("Invalid email");
      setIsLoading(false);
      return;
    }

    const response = await requestEmailVerification(targetEmail);

    if (response.success) {
      setCooldownRemaining(COOLDOWN_TIME);
      setSuccess(true);
    } else {
      setSuccess(false);
      setGlobalError(response.message);
    }
    setIsLoading(false);
  };

  const handleResendEmail = async () => {
    if (cooldownRemaining > 0) return;
    await sendVerificationEmail();
  };

  useEffect(() => {
    const isValidEmail = emailSchema.safeParse({ email: targetEmail }).success;

    if (!isValidEmail || !targetEmail) {
      setSuccess(false);
      setGlobalError("Invalid email");
      setIsLoading(false);
      return;
    } else {
      sendVerificationEmail();
    }
  }, [targetEmail]);

  return (
    <MaxWidthWrapper className="grid place-content-center h-full">
      <Card className="w-full sm:w-[400px] lg:w-[500px] text-center min-h-[380px] shadow-md mx-auto">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {isLoading && <p>Sending verification link to {targetEmail}...</p>}
            {success && !isLoading && <p>Verification link sent</p>}
            {!success && !isLoading && <p>Failed to send verification link!</p>}
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
              <EmailSuccessAnimation className="size-30 mx-auto" />
              <P className="text-green-600">
                Success! We've sent a verification link to {targetEmail}
              </P>
              <div className="flex flex-col gap-4">
                <P className="text-sm">
                  Can't find the email in your inbox or spam folder?
                </P>
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading || cooldownRemaining > 0}
                >
                  {cooldownRemaining > 0
                    ? `Resend available in ${cooldownRemaining} seconds`
                    : "Resend verification email"}
                </Button>
              </div>
            </>
          )}
          {!success && !isLoading && (
            <>
              <div className="flex justify-center">
                <EmailFailAnimation className="h-24 w-24 animate-pulse" />
              </div>
              <div className="flex flex-col gap-4">
                <P className="text-destructive">
                  We couldn't send the verification email to {targetEmail}
                </P>
                {globalError && (
                  <P className="text-destructive text-sm">
                    Error: {globalError}
                  </P>
                )}
                <Button onClick={handleResendEmail} disabled={isLoading}>
                  Retry sending email
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default EmailVerificationReminderCard;
