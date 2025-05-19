"use server";

import { Resend } from "resend";
import { config } from "@/lib/config";
import VerificationEmailTemplate from "@/emails/verification-email-template";
import PasswordResetEmailTemplate from "@/emails/password-reset-template";

const resend = new Resend(config.resend.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  email,
  token,
  username,
}: {
  email: string;
  token: string;
  username: string;
}) => {
  const verificationLink = `${config.BASE_URL}/auth/verify-email?token=${token}&email=${email}`;

  const { data, error } = await resend.emails.send({
    from: config.resend.WEBSITE_EMAIL_ADDRESS,
    to: email,
    subject: "RIPL | Email Verification",
    react: VerificationEmailTemplate({ username, email, verificationLink }),
  });

  if (error) {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  } else {
    return {
      success: true,
      message: "Verification email sent",
    };
  }
};

export const sendPasswordResetEmail = async ({
  email,
  token,
  username = "User",
}: {
  email: string;
  token: string;
  username: string;
}) => {
  const resetLink = `${config.BASE_URL}/auth/reset-password?token=${token}&email=${email}`;

  const { data, error } = await resend.emails.send({
    from: config.resend.WEBSITE_EMAIL_ADDRESS,
    to: email,
    subject: "RIPL | Password Reset",
    react: PasswordResetEmailTemplate({ username, email, resetLink }),
  });

  if (error) {
    return {
      success: false,
      message: "Failed to send password reset email",
    };
  } else {
    return {
      success: true,
      message: "Password reset email sent",
    };
  }
};
