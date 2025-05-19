"use server";

import { prisma } from "@/lib/db";
import { emailSchema, PasswordResetSchema } from "../lib/schemas";
import { nanoid } from "nanoid";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/actions/mailing";
import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";

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
  const generatedToken = await generateVerificationToken(email);

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

export const generateVerificationToken = async (email: string) => {
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
  // check if token exists

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      token: token,
    },
  });

  if (!existingToken) {
    return {
      success: false,
      message: "Invalid token, try again!",
    };
  }

  // check if token is expired
  const hasExpired = existingToken.expires < new Date();

  if (hasExpired) {
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
    return {
      success: false,
      message: "Failed to verify email, try again!",
    };
  }

  // delete the token
  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: true,
    message: "Email verified successfully",
  };
};

export const requestPasswordResetEmail = async (email: string) => {
  console.log("Starting requestPasswordResetEmail function");

  // input validation
  const validatedData = emailSchema.safeParse({ email });
  console.log("Validated data:", validatedData);

  if (!validatedData.success) {
    console.log("Validation failed");
    return {
      success: false,
      message: "Please enter a valid email address",
    };
  }

  email = validatedData.data.email.toLowerCase();
  console.log("Normalized email:", email);

  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      accounts: true,
    },
  });

  // if user is google account, don't allow password reset

  const isAGoogleAccount = user?.accounts.some(
    (acc) => acc.provider === "google"
  );

  if (isAGoogleAccount) {
    console.log("User signed up with a Google account");
    return {
      success: false,
      message: "User signed up with a Google account, no password to reset",
    };
  }

  // generate the token
  const { token } = await generateVerificationToken(email);
  console.log("Generated token:", token);

  if (!token) {
    console.log("Failed to generate password reset token");
    return {
      success: false,
      message: "Failed to generate password reset token, try again later",
    };
  }

  // send the email
  const response = await sendPasswordResetEmail({
    email,
    token,
    username: user?.userName,
  });
  console.log("Email sending response:", response);

  if (!response.success) {
    console.log("Failed to send password reset email");
    return {
      success: false,
      message: "Failed to send password reset email, try again later",
    };
  } else {
    console.log("Password reset email sent successfully");
    return {
      success: true,
      message: "Password reset email sent",
    };
  }
};

export const resetPassword = async ({
  token,
  password,
  confirmPassword,
}: {
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  // no token provided

  if (!token) {
    return {
      success: false,
      message: "Invalid verification link, please try again.",
    };
  }
  // input validation

  const validatedData = PasswordResetSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!validatedData.success) {
    return {
      success: false,
      message: "Password does not meet the requirements",
    };
  }

  try {
    // check if the token exists
    const existingToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!existingToken) {
      return {
        success: false,
        message: "Invalid verification link, please try again.",
      };
    }

    // check if the token has expired

    const hasExpired = existingToken.expires < new Date();

    if (hasExpired) {
      return {
        success: false,
        message: "Verification link has expired, please try again.",
      };
    }

    // hash the password

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // update the user's password

    const updatedUser = await prisma.user.update({
      where: {
        email: existingToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "Failed to reset password, please try again.",
      };
    }

    // delete the token

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};
