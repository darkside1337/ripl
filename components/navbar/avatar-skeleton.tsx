import { Skeleton } from "@/components/ui/skeleton";

export default function AvatarSkeleton() {
  return (
    <div className="w-full flex mt-auto justify-center rounded-full py-2 overflow-hidden">
      <div className="flex items-center lg:gap-2 w-full justify-center">
        <Skeleton className="size-12 rounded-full" />
        <div className="hidden lg:flex items-center gap-2 h-full min-w-24">
          <div className="flex flex-col gap-2 items-start min-w-24">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="ml-auto rounded-full p-2">
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
