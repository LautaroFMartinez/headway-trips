'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cross-browser smooth scroll to top using requestAnimationFrame
 */
function smoothScrollToTop(duration: number = 600): void {
  const startY = window.scrollY;
  const startTime = performance.now();

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || startY < 1) {
    window.scrollTo(0, 0);
    return;
  }

  // Easing function: easeInOutCubic
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateScroll(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY * (1 - easedProgress));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 400px
      setIsVisible(window.scrollY > 400);
    };

    // Add scroll event listener with passive for better performance
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    smoothScrollToTop(600);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed bottom-6 right-6 z-50">
          <Button onClick={scrollToTop} size="icon" className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow" aria-label="Volver arriba">
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
