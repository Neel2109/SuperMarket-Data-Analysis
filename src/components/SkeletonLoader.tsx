import React from 'react';

/** Shimmer skeleton used as placeholder while data loads */
export const SkeletonLoader: React.FC = () => {
  const shimmer = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded";

  return (
    <div className="space-y-6 py-4">
      {/* KPI Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="themed-card rounded-2xl p-5 border space-y-3">
            <div className={`${shimmer} h-3 w-20`} />
            <div className={`${shimmer} h-7 w-28`} />
            <div className={`${shimmer} h-2 w-16`} />
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="themed-card rounded-2xl p-5 border space-y-4">
            <div className={`${shimmer} h-3 w-32`} />
            <div className={`${shimmer} h-[200px] w-full rounded-xl`} />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="themed-card rounded-2xl p-5 border space-y-3">
        <div className={`${shimmer} h-3 w-40`} />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4">
            <div className={`${shimmer} h-4 flex-1`} />
            <div className={`${shimmer} h-4 w-20`} />
            <div className={`${shimmer} h-4 w-16`} />
            <div className={`${shimmer} h-4 w-24`} />
          </div>
        ))}
      </div>
    </div>
  );
};
