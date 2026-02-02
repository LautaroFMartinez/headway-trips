'use client';

import { useCallback, useState, useEffect } from 'react';

/**
 * Cross-browser smooth scroll implementation using requestAnimationFrame
 * This works reliably on all browsers including Windows Chrome/Brave
 *
 * FIX: Desactiva temporalmente scroll-behavior: smooth durante la animación
 * para evitar conflictos entre CSS y JavaScript scroll (ver GitHub issue vercel/next.js#45187)
 */
function smoothScrollTo(targetY: number, duration: number = 600): void {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || Math.abs(difference) < 1) {
    window.scrollTo(0, targetY);
    return;
  }

  // Desactivar scroll-behavior: smooth temporalmente para evitar conflictos
  const html = document.documentElement;
  const originalScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  // Easing function: easeInOutCubic
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScroll(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      // Restaurar scroll-behavior original cuando termine la animación
      html.style.scrollBehavior = originalScrollBehavior;
    }
  }

  requestAnimationFrame(animateScroll);
}

/**
 * Hook to handle smooth scroll with offset for fixed headers
 * Uses requestAnimationFrame for cross-browser compatibility
 * Usage: const handleAnchorClick = useSmoothScroll(80) // 80px offset for header
 */
export function useSmoothScroll(offset: number = 80) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href');

      // Only handle anchor links
      if (href?.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;

          // Use our custom smooth scroll implementation
          smoothScrollTo(offsetPosition, 600);

          // Update URL without jumping
          window.history.pushState(null, '', href);
        }
      }
    },
    [offset],
  );

  return handleClick;
}

/**
 * Hook to track active section in viewport for scroll spy navigation
 * Usage: const activeSection = useScrollSpy(['section1', 'section2'], 100)
 */
export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -50% 0px`,
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, offset]);

  return activeSection;
}

import React from 'react';
