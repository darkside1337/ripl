import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <MaxWidthWrapper className="grid place-content-center h-full">
      <Card className="min-w-[350px] md:min-w-[400px] md:max-w-[400px]">
        <CardHeader>
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-6 h-full justify-center">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
