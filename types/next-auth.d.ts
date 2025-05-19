import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    userName?: string | null;
    fullName?: string | null;
    role?: string | null;
  }
  interface Sesssion {
    user: {
      id: string;
      userName?: string | null;
      fullName?: string | null;
      role?: string | null;
    } & DefaultSession["user"];
  }
}
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName?: string | null;
    fullName?: string | null;
    role?: string | null;
  }
}
