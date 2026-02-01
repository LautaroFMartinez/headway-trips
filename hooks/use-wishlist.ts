'use client';

import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const toggleWishlist = (id: string) => {
    const newWishlist = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  return { wishlist, toggleWishlist };
}
