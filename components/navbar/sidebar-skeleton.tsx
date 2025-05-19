"use client";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NAV_ITEMS } from "./sidebar";
import AvatarSkeleton from "./avatar-skeleton";
// Define the same NAV_ITEMS length as your original component
const NAV_ITEMS_LENGTH = 5; // Adjust this based on your actual NAV_ITEMS array length

export default function SidebarSkeleton({ className }: { className?: string }) {
  return (
    <aside
      className={twMerge(
        "hidden md:flex flex-col fixed h-dvh border-r px-4 py-6 items-start gap-8 shadow-lg",
        "lg:w-[var(--sidebar-width-desktop)]",
        "md:w-[var(--sidebar-width-tablet)]",
        className
      )}
    >
      {/* Logo Skeleton */}
      <div className="lg:ml-3">
        <Skeleton className="rounded-3xl md:size-15" />
      </div>

      {/* Nav Items Skeleton */}
      <div className="w-full flex flex-col gap-6">
        {Array.from({ length: NAV_ITEMS.length }).map((_, index) => (
          <SidebarItemSkeleton key={index} />
        ))}

        {/* Tweet Button Skeleton */}
        <TweetButtonSkeleton />
      </div>

      {/* Avatar Skeleton */}
      <div className="mt-auto">
        <AvatarSkeleton />
      </div>
    </aside>
  );
}
function TweetButtonSkeleton() {
  return (
    <div className="flex justify-center w-full mt-2">
      <Skeleton className="h-12 w-12 rounded-full md:h-12 md:w-12 lg:w-full" />
    </div>
  );
}
function SidebarItemSkeleton() {
  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "rounded-full px-4 py-6 text-xl flex md:justify-center lg:justify-start items-center gap-3 "
      )}
    >
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-4 w-24 hidden lg:block" />
    </div>
  );
}
