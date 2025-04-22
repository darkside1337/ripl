import Google from "next-auth/providers/google";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/schemas";
import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

class CustomLoginError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // validate inputs
        const validatedInputs = SignInSchema.safeParse(credentials);

        if (!validatedInputs.success) {
          throw new CustomLoginError(
            "Invalid email or password, please try again"
          );
        }
        // check if user exists
        try {
          const { email, password } = validatedInputs.data;

          const userExists = await prisma.user.findFirst({
            where: {
              email: email.toLowerCase(),
            },
          });

          if (!userExists || !userExists.password) {
            throw new CustomLoginError(
              "Invalid email or password, please try again"
            );
          }

          // password match

          const passwordMatch = await bcrypt.compare(
            password,
            userExists.password
          );

          if (!passwordMatch) {
            throw new CustomLoginError(
              "Invalid email or password, please try again"
            );
          }

          return userExists;
        } catch (error) {
          throw new CustomLoginError(
            "Oops, something went wrong, please try again"
          );
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
