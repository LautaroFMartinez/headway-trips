'use client';

import { ReactNode } from 'react';
import { useLazyLoad } from '@/hooks/use-lazy-load';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  animateIn?: boolean;
}

const defaultFallback = (
  <div className="flex items-center justify-center py-24">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

export function LazySection({
  children,
  className,
  fallback = defaultFallback,
  rootMargin = '200px',
  threshold = 0,
  animateIn = true,
}: LazySectionProps) {
  const { ref, hasBeenVisible } = useLazyLoad<HTMLDivElement>({
    rootMargin,
    threshold,
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        animateIn && hasBeenVisible && 'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      {hasBeenVisible ? children : fallback}
    </div>
  );
}
