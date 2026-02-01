'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 400px
      setIsVisible(window.scrollY > 400);
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
