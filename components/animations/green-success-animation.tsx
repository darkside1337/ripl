"use client";

import animationPath from "@/components/animations/GreenSuccessAnimation.json";
import { cn } from "@/lib/utils";
import { useLottie } from "lottie-react";

export default function GreenSuccessAnimation({
  className,
}: {
  className?: string;
}) {
  const options = {
    animationData: animationPath,
    loop: true,
    autoplay: true,
  };
  const { View, setSpeed } = useLottie(options);

  setSpeed(0.6);

  return <div className={cn(className)}>{View}</div>;
}
