"use server";

import { prisma } from "@/lib/db";
import { emailSchema } from "../lib/schemas";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "@/actions/mailing";
// TODO generateEmailVerificationToken, generateResetPasswordToken, requestEmailVerification

export const requestEmailVerification = async (email: string) => {
  // input validation
  const validatedData = emailSchema.safeParse({ email });

  if (!validatedData.success) {
    return {
      success: false,
      message: "Please enter a valid email address",
    };
  }

  email = validatedData.data.email.toLowerCase();

  // checks if the user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "If an account exists with this email, you will receive a verification email shortly.",
    };
  }

  // checks if the user is already verified

  if (user.emailVerified) {
    return {
      success: false,
      message:
        "If an account exists with this email, you will receive a verification email shortly.",
    };
  }

  // generate the Token
  const generatedToken = await generateEmailVerificationToken(email);

  if (!generatedToken) {
    return {
      success: false,
      message: "Failed to generate verification token, try again later",
    };
  }

  const { token } = generatedToken;

  // sends the verification email;

  const response = await sendVerificationEmail({
    email,
    token,
    username: user.userName,
  });

  if (!response.success) {
    return {
      success: false,
      message: "Failed to send verification email, try again later",
    };
  } else {
    return {
      success: true,
      message: "Verification email sent",
    };
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  // generates the token

  const token = nanoid();

  // token expires in an hour

  const expires = new Date(Date.now() + 60 * 60 * 1000);

  // check if user already has a token

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    // delete previous token
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // creates the token

  const generatedToken = await prisma.verificationToken.create({
    data: {
      email,
      token: token,
      expires: expires,
    },
  });

  return generatedToken;
};

export const verifyEmail = async (token: string) => {
  console.log("verifyEmail:", token);

  // check if token exists

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      token: token,
    },
  });

  if (!existingToken) {
    console.log("verifyEmail: No existing token found");
    return {
      success: false,
      message: "Invalid token, try again!",
    };
  }

  console.log("verifyEmail: Found existing token:", existingToken);

  // check if token is expired
  const hasExpired = existingToken.expires < new Date();

  if (hasExpired) {
    console.log("verifyEmail: Token has expired");
    return {
      success: false,
      message: "Token expired, try again!",
    };
  }

  // validate the user's email

  const updatedUser = await prisma.user.update({
    where: {
      email: existingToken.email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  if (!updatedUser) {
    console.log("verifyEmail: Failed to verify email");
    return {
      success: false,
      message: "Failed to verify email, try again!",
    };
  }

  console.log("verifyEmail: Email verified successfully");

  // delete the token
  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  console.log("verifyEmail: Token deleted successfully");

  return {
    success: true,
    message: "Email verified successfully",
  };
};
