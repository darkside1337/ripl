import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Starting signIn process");

      if (!user.email) {
        console.error("Sign in failed: user has no email");
        return false;
      }

      try {
        console.log("Looking for existing user");
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          console.log("No existing user found, proceeding with sign in");
          return true;
        }

        const isEmailVerified = Boolean(existingUser.emailVerified);
        console.log(`Email verification status: ${isEmailVerified}`);

        const emailVerificationReminderLink = `/auth/email-verification-reminder?email=${encodeURIComponent(existingUser.email)}`;
        console.log("Email verification link:", emailVerificationReminderLink);
        if (!isEmailVerified && account?.provider === "credentials") {
          console.log(
            "Email not verified for credentials provider, redirecting"
          );
          return emailVerificationReminderLink;
        }

        if (account?.provider === "google") {
          console.log("Handling Google account linking");
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!linkedAccount) {
            if (isEmailVerified) {
              console.log("Linking Google account to verified user");
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              });
              console.log("Google account linked successfully to:", user.email);
            } else {
              console.log(
                "User not verified, redirecting for email verification"
              );
              return emailVerificationReminderLink;
            }
          }
        }

        console.log("Sign in process completed successfully");
        return true;
      } catch (error) {
        console.error("Sign in failed:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          userName: user.userName,
          fullName: user.fullName,
        };
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role,
        userName: token.userName,
        fullName: token.fullName,
      };
      return session;
    },
  },
  ...authConfig,
});
