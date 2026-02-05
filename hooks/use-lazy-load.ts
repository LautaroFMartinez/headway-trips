'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseLazyLoadOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

interface UseLazyLoadReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

/**
 * Custom hook for lazy loading elements using Intersection Observer API.
 * Optimizes LCP by deferring off-screen content loading until needed.
 * 
 * @param options - IntersectionObserver options plus freezeOnceVisible flag
 * @returns ref to attach to element, visibility state, and historical visibility
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn<T> {
  const {
    threshold = 0,
    root = null,
    rootMargin = '100px',
    freezeOnceVisible = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const frozen = freezeOnceVisible && hasBeenVisible;

  const updateVisibility = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const isIntersecting = entry?.isIntersecting ?? false;
      
      if (frozen) return;

      setIsVisible(isIntersecting);
      
      if (isIntersecting) {
        setHasBeenVisible(true);
      }
    },
    [frozen]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || frozen) return;

    const observer = new IntersectionObserver(updateVisibility, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, frozen, updateVisibility]);

  return { ref, isVisible, hasBeenVisible };
}
