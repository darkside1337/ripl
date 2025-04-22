"use client";
import animationPath from "@/components/animations/EmailSuccessAnimation.json";
import { cn } from "@/lib/utils";
import { useLottie } from "lottie-react";

export default function EmailSuccessAnimation({
  className = "",
}: {
  className: string;
}) {
  const options = {
    animationData: animationPath,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);

  return <div className={`${cn(className)}`}>{View}</div>;
}
