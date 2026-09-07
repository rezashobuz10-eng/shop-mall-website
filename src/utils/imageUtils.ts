import React from 'react';

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'Mobile Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  'Computers': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  "Men's Fashion": 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
  "Women's Fashion": 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'Sports': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'Automotive': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
};

export const KNOWN_IMAGE_REPLACEMENTS: Record<string, string> = {
  // Xiaomi Power Bank (fixed 404 URL)
  'https://images.unsplash.com/photo-1609592424361-b4ef1ef13426?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
  // SS Ton Cricket Bat
  'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  // Sihoo Chair
  'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
  // Yoga Mat image 2
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  // Football image 1
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
};

export function sanitizeImageUrl(url?: string, category?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return (category && CATEGORY_FALLBACK_IMAGES[category]) || FALLBACK_PRODUCT_IMAGE;
  }
  const clean = url.trim();
  if (KNOWN_IMAGE_REPLACEMENTS[clean]) {
    return KNOWN_IMAGE_REPLACEMENTS[clean];
  }
  return clean;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  backupUrl?: string
) {
  const target = e.currentTarget;
  const fallback = backupUrl && backupUrl.trim() !== '' ? backupUrl : FALLBACK_PRODUCT_IMAGE;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
