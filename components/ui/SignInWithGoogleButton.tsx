import { Button } from "@/components/ui/button";
import GoogleIconSVG from "../SVGs/GoogleIconSVG";
import { handleGoogleSignIn } from "@/actions/authActions";

interface GoogleSignInButtonProps {
  className?: string;
}

export default function SignInWithGoogleButton({
  className = "",
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className={`w-full flex items-center gap-2 ${className} hover:cursor-pointer`}
      onClick={handleGoogleSignIn}
      type="button"
    >
      <GoogleIconSVG />
      <span>Sign in with Google</span>
    </Button>
  );
}
