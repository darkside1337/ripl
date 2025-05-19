import MaxWidthWrapper from "@/components/max-width-wrapper";
import ResetPasswordForm from "@/components/reset-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <MaxWidthWrapper className="grid place-content-center h-full">
      <Card className="min-w-[350px] md:min-w-[400px] md:max-w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password and confirm it
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-6 h-full justify-center">
          <ResetPasswordForm /> 
          
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
