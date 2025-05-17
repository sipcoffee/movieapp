import React from "react";
import { Skeleton } from "./ui/skeleton";

export function MovieDetailsSkeletonLoader() {
  return (
    <div className="h-screen flex items-start p-6 flex-col gap-4">
      <Skeleton className="h-70 w-full rounded-2xl bg-slate-500/60" />
      <Skeleton className="h-30 w-80 rounded-2xl bg-slate-500/60" />
      <div className="flex gap-3">
        <Skeleton className="h-12 w-30 rounded-2xl bg-slate-500/60" />
        <Skeleton className="h-12 w-30 rounded-2xl bg-slate-500/60" />
        <Skeleton className="h-12 w-30 rounded-2xl bg-slate-500/60" />
      </div>
      <Skeleton className="h-35 w-xl rounded-2xl bg-slate-500/60" />
    </div>
  );
}

export function MovieCardSkeleton({ count = 12 }) {
  // Create an array with length = count to map over
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
      {skeletons.map((_, index) => (
        <Skeleton
          key={index}
          className="relative aspect-[2/3] w-full rounded-2xl bg-slate-500/60"
        />
      ))}
    </div>
  );
}
