import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Session } from "next-auth";
import NavbarSkeleton from "@/components/navbar/navbar-skeleton";

export const metadata: Metadata = {
  title: "ripL",
  description: "ripL, a social media app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function AuthenticatedLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session;
}>) {
  return (
    <MaxWidthWrapper className="">
      <SessionProvider session={session}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main
          className={cn(
            "h-[2000px]",
            `ml-0 md:ml-[var(--sidebar-width-tablet)] lg:ml-[var(--sidebar-width-desktop)] px-4 md:px-0`
          )}
        >
          {children}
        </main>
      </SessionProvider>
    </MaxWidthWrapper>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const isAuthenticated = session?.user;
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`antialiased h-full ${poppins.className} relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {isAuthenticated ? (
            <AuthenticatedLayout session={session}>
              {children}
            </AuthenticatedLayout>
          ) : (
            children
          )}
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
