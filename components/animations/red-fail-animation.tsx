"use client";
import { useLottie } from "lottie-react";
import animationPath from "@/components/animations/RedFailAnimation.json";
import { cn } from "@/lib/utils";
export default function RedFailAnimation({
  className,
}: {
  className?: string;
}) {
  const options = {
    animationData: animationPath,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);

  return <div className={cn(className)}>{View}</div>;
}
