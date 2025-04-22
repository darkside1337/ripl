import { H1, H4, P } from "@/components/typography";
import Link from "next/link";
import SignUpPatternSVG from "@/components/SVGs/SignUpPatternSVG";
import SignUpForm from "@/components/auth/sign-up-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-full grid grid-cols-1 lg:grid-cols-2 px-4 py-12 md:px-6 md:py-14 lg:px-0 lg:py-0">
      <div className="flex items-center justify-center">
        <div className="flex flex-col md:w-[400px] justify-center py-10 px-8 lg:py-12 gap-2 text-center lg:text-left">
          <H1>
            Welcome to{" "}
            <span className="underline underline-offset-8 decoration-8 decoration-blue-400 dark:decoration-blue-600">
              ripL
            </span>
          </H1>
          <H4 className="my-3 text-center">
            Join the conversation. Create your account today.
          </H4>
          <SignUpForm />
          <P className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            Already have an account?{" "}
            <Link
              className="hover:text-blue-500 transition-colors duration-300"
              href="/auth/sign-in"
            >
              Sign In
            </Link>{" "}
          </P>
        </div>
      </div>
      <div className="hidden lg:block relative">
        <SignUpPatternSVG className="h-full w-full" />
      </div>
    </div>
  );
};

export default SignUpPage;
