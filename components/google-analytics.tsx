'use client';

import { GoogleAnalytics as GA } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  // No renderizar si no hay GA_ID configurado
  if (!GA_ID) {
    return null;
  }

  return <GA gaId={GA_ID} />;
}

// Hook para trackear eventos personalizados
export function useAnalytics() {
  const trackEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      });
    }
  };

  // Eventos específicos para Headway Trips
  const trackSearch = (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  };

  const trackTripView = (tripId: string, tripName: string, price: number) => {
    trackEvent('view_item', {
      item_id: tripId,
      item_name: tripName,
      price: price,
      currency: 'USD',
    });
  };

  const trackQuoteRequest = (tripId: string, tripName: string, price: number) => {
    trackEvent('generate_lead', {
      item_id: tripId,
      item_name: tripName,
      value: price,
      currency: 'USD',
    });
  };

  const trackAddToWishlist = (tripId: string, tripName: string) => {
    trackEvent('add_to_wishlist', {
      item_id: tripId,
      item_name: tripName,
    });
  };

  const trackComparison = (tripIds: string[]) => {
    trackEvent('compare_items', {
      items: tripIds.join(','),
      items_count: tripIds.length,
    });
  };

  const trackContactClick = (method: 'whatsapp' | 'email' | 'phone' | 'form') => {
    trackEvent('contact', {
      method: method,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackTripView,
    trackQuoteRequest,
    trackAddToWishlist,
    trackComparison,
    trackContactClick,
  };
}
