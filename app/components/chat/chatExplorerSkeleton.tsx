import { Skeleton } from "@/components/ui/skeleton";

export function ChatExplorerSkeleton() {
  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Filter Sidebar Skeleton */}
      <aside className="hidden w-80 flex-col border-r p-4 space-y-4 lg:flex">
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </aside>

      {/* Message Stream Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-end gap-2 justify-end">
            <Skeleton className="h-20 w-3/4 rounded-lg" />
        </div>
        <div className="flex items-end gap-2">
            <Skeleton className="h-24 w-2/3 rounded-lg" />
        </div>
         <div className="flex items-end gap-2 justify-end">
            <Skeleton className="h-16 w-1/2 rounded-lg" />
        </div>
      </div>

      {/* Insight Panel Skeleton */}
      <aside className="hidden w-96 flex-col border-l p-4 space-y-4 xl:flex">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </aside>
    </div>
  );
}