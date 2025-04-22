import SignInForm from "@/components/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { H1, H4 } from "@/components/typography";

// for a header

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const SignInPage = () => {
  return (
    <div className="min-h-full grid grid-cols-1 lg:grid-cols-2 px-4 py-12 md:px-6 md:py-14 lg:px-0 lg:py-0">
      <div className="flex items-center justify-center">
        <Card className="md:w-[400px] justify-center py-10 lg:py-12 gap-8 text-center lg:text-left">
          <CardHeader>
            <CardTitle className={`text-center ${roboto.className}`}>
              <H1>
                Welcome to{" "}
                <span className="underline underline-offset-8 decoration-8 decoration-blue-400 dark:decoration-blue-600">
                  ripL
                </span>
              </H1>
            </CardTitle>
            <CardDescription>
              <H4 className="mt-3">Sign in to continue.</H4>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:block relative">
        <Image
          alt="pattern image"
          src="/pattern.webp"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default SignInPage;
