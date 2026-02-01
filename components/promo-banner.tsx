'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag } from 'lucide-react';

import { getActivePromotions, getTimeRemaining, type Promotion } from '@/lib/promotions-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  position?: 'top' | 'bottom';
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

export function PromoBanner({ position = 'top', autoRotate = true, rotateInterval = 8000, className }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [activePromos, setActivePromos] = useState<Promotion[]>([]);

  useEffect(() => {
    const promos = getActivePromotions();
    setActivePromos(promos);
  }, []);

  useEffect(() => {
    if (!autoRotate || activePromos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % activePromos.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, activePromos.length]);

  useEffect(() => {
    // Check if user has dismissed banner in this session
    const dismissed = sessionStorage.getItem('promoBannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('promoBannerDismissed', 'true');
  };

  if (!isVisible || activePromos.length === 0) return null;

  const currentPromo = activePromos[currentPromoIndex];

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className={cn('w-full', className)}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div key={currentPromoIndex} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm sm:text-base">{currentPromo.title}</p>
                    <p className="text-xs sm:text-sm text-white/90">{currentPromo.description}</p>
                  </div>
                </div>

                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 whitespace-nowrap">
                  Código: {currentPromo.code}
                </Badge>

                <PromoCountdown targetDate={currentPromo.validUntil} />
              </motion.div>
            </AnimatePresence>

            <Button variant="ghost" size="icon" onClick={handleDismiss} className="text-white hover:bg-white/20 flex-shrink-0" aria-label="Cerrar banner">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress indicators for multiple promos */}
          {activePromos.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {activePromos.map((_, index) => (
                <button key={index} onClick={() => setCurrentPromoIndex(index)} className={cn('h-1.5 rounded-full transition-all', index === currentPromoIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40')} aria-label={`Ver promoción ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface PromoCountdownProps {
  targetDate: Date;
  compact?: boolean;
}

function PromoCountdown({ targetDate, compact = false }: PromoCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-white/90">
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock className="w-4 h-4 flex-shrink-0" />
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono font-bold">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[10px] text-white/70 mt-0.5">días</span>
            </div>
            <span>:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/70 mt-0.5">hrs</span>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/70 mt-0.5">min</span>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/70 mt-0.5">seg</span>
        </div>
      </div>
    </div>
  );
}

// Compact promo card for displaying in lists
interface PromoCardProps {
  promotion: Promotion;
  onApply?: (code: string) => void;
  className?: string;
}

export function PromoCard({ promotion, onApply, className }: PromoCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{promotion.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{promotion.description}</p>
            <Badge variant="outline" className="font-mono">
              {promotion.code}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{promotion.discountType === 'percentage' ? `${promotion.discountValue}%` : `$${promotion.discountValue.toLocaleString('es-AR')}`}</div>
            <div className="text-xs text-muted-foreground">OFF</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <PromoCountdown targetDate={promotion.validUntil} compact />
          {onApply && (
            <Button size="sm" onClick={() => onApply(promotion.code)}>
              Aplicar
            </Button>
          )}
        </div>

        {promotion.minPurchase && <p className="text-xs text-muted-foreground mt-2">* Compra mínima: ${promotion.minPurchase.toLocaleString('es-AR')}</p>}
      </CardContent>
    </Card>
  );
}
