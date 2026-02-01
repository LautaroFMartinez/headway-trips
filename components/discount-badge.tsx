'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DiscountBadgeProps {
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSavings?: boolean;
}

export function DiscountBadge({ discountType, discountValue, size = 'md', className, showSavings = true }: DiscountBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const displayValue = discountType === 'percentage' ? `${discountValue}% OFF` : `-$${discountValue.toLocaleString('es-AR')}`;

  return (
    <Badge className={cn('bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold border-0 shadow-md', sizeClasses[size], className)}>
      {showSavings && <span className="mr-1">🎉</span>}
      {displayValue}
    </Badge>
  );
}

interface PriceDisplayProps {
  originalPrice: number;
  finalPrice: number;
  showOriginal?: boolean;
  className?: string;
}

export function PriceDisplay({ originalPrice, finalPrice, showOriginal = true, className }: PriceDisplayProps) {
  const hasDiscount = originalPrice > finalPrice;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {hasDiscount && showOriginal && <span className="text-muted-foreground line-through text-sm md:text-base">${originalPrice.toLocaleString('es-AR')}</span>}
      <span className={cn('font-bold text-lg md:text-xl', hasDiscount ? 'text-green-600 dark:text-green-500' : 'text-foreground')}>${finalPrice.toLocaleString('es-AR')}</span>
      {hasDiscount && <DiscountBadge discountType="percentage" discountValue={Math.round(((originalPrice - finalPrice) / originalPrice) * 100)} size="sm" />}
    </div>
  );
}
