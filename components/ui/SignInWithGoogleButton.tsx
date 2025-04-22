"use client";

import { Button } from "@/components/ui/button";
import GoogleIconSVG from "../SVGs/GoogleIconSVG";

interface GoogleSignInButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function SignInWithGoogleButton({
  onClick,
  className = "",
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className={`w-full flex items-center gap-2 ${className} hover:cursor-pointer`}
      onClick={onClick}
      type="button"
    >
      <GoogleIconSVG />
      <span>Sign in with Google</span>
    </Button>
  );
}
