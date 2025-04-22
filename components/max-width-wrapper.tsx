import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import React from "react";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: ClassValue;
};

const MaxWidthWrapper = ({ children, className }: MaxWidthWrapperProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 lg:p-12", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
