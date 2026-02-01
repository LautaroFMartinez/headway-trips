export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableTrips?: string[]; // Empty means all trips
}

// Mock promotions data (replace with database in production)
export const promotions: Promotion[] = [
  {
    id: '1',
    code: 'VERANO2026',
    title: 'Descuento de Verano',
    description: 'Aprovechá hasta 20% de descuento en todos los viajes de verano',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 300000,
    maxDiscount: 80000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-03-31'),
    isActive: true,
    usageLimit: 100,
    usedCount: 45,
  },
  {
    id: '2',
    code: 'EARLYBIRD',
    title: 'Madrugadores',
    description: 'Reservá con anticipación y ahorrá $50.000',
    discountType: 'fixed',
    discountValue: 50000,
    minPurchase: 400000,
    validFrom: new Date('2026-01-15'),
    validUntil: new Date('2026-02-28'),
    isActive: true,
    usageLimit: 50,
    usedCount: 12,
  },
  {
    id: '3',
    code: 'PATAGONIA15',
    title: 'Especial Patagonia',
    description: '15% OFF en viajes a la Patagonia',
    discountType: 'percentage',
    discountValue: 15,
    validFrom: new Date('2026-01-10'),
    validUntil: new Date('2026-04-30'),
    isActive: true,
    applicableTrips: ['bariloche', 'calafate', 'ushuaia'],
    usedCount: 28,
  },
  {
    id: '4',
    code: 'FLASH24H',
    title: 'Oferta Flash 24hs',
    description: '¡Solo por hoy! 25% de descuento en viajes seleccionados',
    discountType: 'percentage',
    discountValue: 25,
    minPurchase: 250000,
    maxDiscount: 100000,
    validFrom: new Date('2026-01-16'),
    validUntil: new Date('2026-01-17'),
    isActive: true,
    usageLimit: 20,
    usedCount: 8,
  },
];

// Helper functions
export function getActivePromotions(): Promotion[] {
  const now = new Date();
  return promotions.filter((promo) => promo.isActive && promo.validFrom <= now && promo.validUntil >= now && (!promo.usageLimit || promo.usedCount < promo.usageLimit));
}

export function getPromotionByCode(code: string): Promotion | undefined {
  return promotions.find((promo) => promo.code.toLowerCase() === code.toLowerCase() && promo.isActive);
}

export function validatePromotion(
  code: string,
  tripId?: string,
  purchaseAmount?: number
): {
  valid: boolean;
  promotion?: Promotion;
  error?: string;
} {
  const promo = getPromotionByCode(code);

  if (!promo) {
    return { valid: false, error: 'Código de promoción inválido' };
  }

  const now = new Date();

  // Check dates
  if (now < promo.validFrom) {
    return { valid: false, error: 'Esta promoción aún no está disponible' };
  }

  if (now > promo.validUntil) {
    return { valid: false, error: 'Esta promoción ha expirado' };
  }

  // Check usage limit
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    return { valid: false, error: 'Esta promoción ya no está disponible' };
  }

  // Check minimum purchase
  if (promo.minPurchase && purchaseAmount && purchaseAmount < promo.minPurchase) {
    return {
      valid: false,
      error: `Monto mínimo de compra: $${promo.minPurchase.toLocaleString('es-AR')}`,
    };
  }

  // Check applicable trips
  if (promo.applicableTrips && promo.applicableTrips.length > 0 && tripId && !promo.applicableTrips.includes(tripId)) {
    return { valid: false, error: 'Esta promoción no aplica a este viaje' };
  }

  return { valid: true, promotion: promo };
}

export function calculateDiscount(
  promo: Promotion,
  originalPrice: number
): {
  discountAmount: number;
  finalPrice: number;
  savings: number;
} {
  let discountAmount = 0;

  if (promo.discountType === 'percentage') {
    discountAmount = (originalPrice * promo.discountValue) / 100;
    if (promo.maxDiscount) {
      discountAmount = Math.min(discountAmount, promo.maxDiscount);
    }
  } else {
    discountAmount = promo.discountValue;
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const savings = originalPrice - finalPrice;

  return {
    discountAmount,
    finalPrice,
    savings,
  };
}

export function getTimeRemaining(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = targetDate.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}
