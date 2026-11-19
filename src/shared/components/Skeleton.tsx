interface SkeletonProps {
  cantidad?: number;
}

export function Skeleton({ cantidad = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-xl border border-stone-200 bg-white p-4"
        >
          <div className="mb-3 h-40 w-full rounded-lg bg-stone-200" />
          <div className="mb-2 h-5 w-2/3 rounded bg-stone-200" />
          <div className="mb-4 h-4 w-full rounded bg-stone-200" />
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 rounded bg-stone-200" />
            <div className="h-9 w-28 rounded-lg bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}