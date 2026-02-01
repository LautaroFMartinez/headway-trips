'use client';

import { useState } from 'react';
import { Check, Tag, X } from 'lucide-react';

import { validatePromotion, calculateDiscount, type Promotion } from '@/lib/promotions-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PromoCodeInputProps {
  originalPrice: number;
  tripId?: string;
  onPromoApplied?: (promotion: Promotion, discount: number) => void;
  onPromoRemoved?: () => void;
  className?: string;
}

export function PromoCodeInput({ originalPrice, tripId, onPromoApplied, onPromoRemoved, className }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyPromo = async () => {
    setError(null);
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const validation = validatePromotion(promoCode.trim(), tripId, originalPrice);

    if (!validation.valid) {
      setError(validation.error || 'Código inválido');
      setIsLoading(false);
      return;
    }

    if (validation.promotion) {
      const { discountAmount } = calculateDiscount(validation.promotion, originalPrice);
      setAppliedPromo(validation.promotion);
      setPromoCode('');
      onPromoApplied?.(validation.promotion, discountAmount);
    }

    setIsLoading(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setError(null);
    onPromoRemoved?.();
  };

  const discount = appliedPromo ? calculateDiscount(appliedPromo, originalPrice) : null;

  return (
    <div className={cn('space-y-3', className)}>
      {!appliedPromo ? (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Código de descuento"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && promoCode.trim()) {
                    handleApplyPromo();
                  }
                }}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleApplyPromo} disabled={!promoCode.trim() || isLoading} className="whitespace-nowrap">
              {isLoading ? 'Validando...' : 'Aplicar'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
        </>
      ) : (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-green-900 dark:text-green-100">Promoción aplicada</p>
                  <p className="text-sm text-green-700 dark:text-green-300">{appliedPromo.title}</p>
                  <Badge variant="outline" className="font-mono border-green-300 text-green-900 dark:text-green-100">
                    {appliedPromo.code}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">-${discount?.discountAmount.toLocaleString('es-AR')}</p>
                <Button variant="ghost" size="sm" onClick={handleRemovePromo} className="text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mt-1">
                  <X className="w-3 h-3 mr-1" />
                  Quitar
                </Button>
              </div>
            </div>

            {discount && (
              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700 dark:text-green-300">Precio original:</span>
                  <span className="line-through text-green-600 dark:text-green-400">${originalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-green-700 dark:text-green-300">Descuento:</span>
                  <span className="font-semibold text-green-700 dark:text-green-400">-${discount.discountAmount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span className="text-green-900 dark:text-green-100">Total a pagar:</span>
                  <span className="text-green-700 dark:text-green-400">${discount.finalPrice.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
