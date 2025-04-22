"use client";
import animationPath from "@/components/animations/EmailFailAnimation.json";
import { cn } from "@/lib/utils";
import { useLottie } from "lottie-react";

export default function EmailFailAnimation({
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
