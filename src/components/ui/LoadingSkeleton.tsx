'use client';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} aria-label="Loading..." />
  );
}

export function TimerSkeleton() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        {/* Category dropdown skeleton */}
        <LoadingSkeleton className="w-48 h-8 mx-auto mb-16" />

        {/* Timer display skeleton */}
        <LoadingSkeleton className="w-64 h-24 mx-auto mb-8" />

        {/* Mode selection buttons skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          <LoadingSkeleton className="w-16 h-8" />
          <LoadingSkeleton className="w-20 h-8" />
          <LoadingSkeleton className="w-20 h-8" />
        </div>

        {/* Circular play button skeleton */}
        <LoadingSkeleton className="w-16 h-16 rounded-full mx-auto" />
      </div>
    </div>
  );
}

export function CategoryRowSkeleton() {
  return (
    <div className="bg-card backdrop-blur rounded-xl p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <LoadingSkeleton className="w-4 h-4 rounded" />
          <LoadingSkeleton className="w-32 h-6" />
        </div>
        <div className="flex gap-2">
          <LoadingSkeleton className="w-4 h-4" />
          <LoadingSkeleton className="w-4 h-4" />
        </div>
      </div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {Array.from({ length: 30 }).map((_, i) => (
          <LoadingSkeleton key={i} className="w-8 h-8" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="w-24 h-4" />
        <LoadingSkeleton className="w-20 h-4" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <CategoryRowSkeleton key={i} />
      ))}
    </div>
  );
}
