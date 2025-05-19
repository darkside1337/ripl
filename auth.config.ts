import Google from "next-auth/providers/google";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/schemas";
import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";
import { generateUniqueUsernameFromEmail } from "./lib/helpers";
import { redirect } from "next/navigation";

class CustomLoginError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "Invalid email or password, please try again";
  }
}

export default {
  providers: [
    Google({
      profile(profile) {
        return {
          userName: generateUniqueUsernameFromEmail(profile.email),
          email: profile.email,
          fullName: profile.name,
          image: profile.picture,
        };
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log("Starting authorize with credentials:", credentials);

        // validate inputs
        const validatedInputs = SignInSchema.safeParse(credentials);

        if (!validatedInputs.success) {
          console.log("Validation failed:", validatedInputs.error);
          throw new CustomLoginError();
        }

        // check if user exists
        const { email, password } = validatedInputs.data;

        console.log("Checking if user exists:", email);

        const userExists = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (!userExists) {
          console.log("User does not exist:", email);
          throw new CustomLoginError();
        }

        if (!userExists.password) {
          console.log("User has no password:", email);
          throw new CustomLoginError();
        }

        // password match

        console.log("Checking password match:");

        const passwordMatch = await bcrypt.compare(
          password,
          userExists.password
        );

        if (!passwordMatch) {
          console.log("Password did not match:", email);
          throw new CustomLoginError();
        }

        console.log("Sign in successful:", email);
        return userExists;
      },
    }),
  ],
} satisfies NextAuthConfig;
