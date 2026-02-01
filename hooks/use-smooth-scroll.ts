'use client';

/**
 * Hook to handle smooth scroll with offset for fixed headers
 * Usage: const handleAnchorClick = useSmoothScroll(80) // 80px offset for header
 */
export function useSmoothScroll(offset: number = 80) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');

    // Only handle anchor links
    if (href?.startsWith('#')) {
      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL without jumping
        window.history.pushState(null, '', href);
      }
    }
  };

  return handleClick;
}

/**
 * Hook to track active section in viewport for scroll spy navigation
 * Usage: const activeSection = useScrollSpy(['section1', 'section2'], 100)
 */
export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  React.useEffect(() => {
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
      }
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
