import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse p-3 flex flex-col gap-3">
      <div className="w-full pt-[100%] bg-slate-200 rounded-xl relative"></div>
      <div className="h-3 bg-slate-200 rounded-sm w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded-sm w-5/6"></div>
      <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 bg-slate-200 rounded-sm w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded-sm w-1/4"></div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded-sm w-1/4 mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/2"></div>
          </div>
          <div className="w-20 h-5 bg-slate-200 rounded-sm"></div>
        </div>
      ))}
    </div>
  );
};
