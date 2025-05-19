import SignInForm from "@/components/auth/sign-in-form";
import { H1, H4, P } from "@/components/typography";
import Link from "next/link";
import SignInPatternSVG from "@/components/SVGs/SignInPattenSVG";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-full grid grid-cols-1 lg:grid-cols-2 px-4 py-12 md:px-6 md:py-14 lg:px-0 lg:py-0 ">
      <div className="flex items-center justify-center">
        <div className="flex flex-col md:w-[400px] justify-center py-10 px-8 lg:py-12 gap-2 text-center lg:text-left">
          <H1>
            Welcome to{" "}
            <span className="underline underline-offset-8 decoration-8 decoration-blue-400 dark:decoration-blue-600">
              ripL
            </span>
          </H1>
          <H4 className="my-3 text-center">Sign in to continue.</H4>
          <SignInForm />
          <P className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            Don't have an account?{" "}
            <Link
              className="hover:text-blue-500 transition-colors duration-300"
              href="/auth/sign-up"
            >
              Sign up
            </Link>{" "}
          </P>
        </div>
      </div>
      <div className="hidden lg:block w-full h-full">
        <SignInPatternSVG className="h-full w-full bg-cover" />
      </div>
    </div>
  );
};

export default SignInPage;
