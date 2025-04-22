import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // allow oauth without verification:

      if (account?.provider !== "credentials") return true;

      // check if email is verified
      console.log("signIn callback", user);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email as string,
        },
      });

      if (!existingUser?.emailVerified) {
        return `/auth/email-verification-reminder?email=${user.email}`;
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  ...authConfig,
});
