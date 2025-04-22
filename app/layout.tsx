import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "ripL",
  description: "ripL, a social media app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = false;

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`antialiased h-full min-h-screen ${poppins.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {isAuthenticated ? (
            <MaxWidthWrapper>{children}</MaxWidthWrapper>
          ) : (
            children
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
