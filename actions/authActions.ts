"use server";

import { signIn, signOut } from "@/auth";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { SignInSchema, SignUpSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const crendentialsSignUpAction = async (formData: FormData) => {
  // validate data
  const validatedData = SignUpSchema.safeParse(Object.fromEntries(formData));

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // destructure valid data & lowercase it

  const {
    fullName,
    userName: originalUsername,
    email: originalEmail,
    password,
  } = validatedData.data;
  const userName = originalUsername.toLowerCase();
  const email = originalEmail.toLowerCase();

  // check if username & email already in use

  const emailOrUserNameAlreadyInUse = await prisma.user.findFirst({
    where: {
      OR: [{ userName }, { email }],
    },
  });

  if (emailOrUserNameAlreadyInUse) {
    console.log("Email or username already in use");
    const conflicts = {
      email: emailOrUserNameAlreadyInUse.email === email,
      userName: emailOrUserNameAlreadyInUse.userName === userName,
    };

    return {
      success: false,
      errors: {
        ...(conflicts.email && { email: ["Email already in use"] }),
        ...(conflicts.userName && { userName: ["Username already in use"] }),
      },
    };
  }
  // create user in db
  // a) hash password

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // b) insert in db

  try {
    await prisma.user.create({
      data: {
        fullName,
        userName,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      globalError: "Oops! Something went wrong",
    };
  }

  // sign user in

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return {
    success: true,
    message: "Account created successfully, you will be redirected shortly!",
  };
};

export const credentialsSignInAction = async (formData: FormData) => {
  console.log("Starting credentialsSignInAction");

  // validate data
  const validatedData = SignInSchema.safeParse(Object.fromEntries(formData));
  console.log("Validation result:", validatedData);

  if (!validatedData.success) {
    console.log(
      "Validation failed:",
      validatedData.error.flatten().fieldErrors
    );
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  // destructure valid data & lowercase it
  const { email: originalEmail, password } = validatedData.data;
  const email = originalEmail.toLowerCase();

  // sign user in
  try {
    console.log(`Attempting sign in for email: ${email}`);

    // signIn fn returns a string if auth is successful

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    redirect(result);

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    console.error("Sign in error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("Invalid credentials");
          return {
            success: false,
            globalError: "Invalid credentials, try again",
          };
      }
    } else {
      throw error;
    }
  }
};

export const handleGoogleSignIn = async () => {
  await signIn("google");
};

export const handleSignOutAction = async () => {
  "use server";
  await signOut({
    redirect: true,
    redirectTo: "/auth/sign-in",
  });
};
