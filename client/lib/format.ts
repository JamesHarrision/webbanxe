/**
 * Shared formatting utilities for VinFast Tiền Giang
 */

/** Parse a Prisma Decimal string or JS number into a plain number */
export const getNumericPrice = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/** Format a number/decimal-string as Vietnamese Đồng (₫) */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return 'Liên hệ';

  // Clean up string to get raw number
  const cleanStr = String(value).replace(/[^\d]/g, '');
  const num = parseInt(cleanStr, 10);

  if (isNaN(num)) return String(value);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
};

/** 
 * Inject Cloudinary optimization parameters (q_auto,f_auto) into the URL.
 * Example: .../upload/v123... -> .../upload/q_auto,f_auto/v123...
 */
export const optimizeImage = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  if (typeof url !== 'string') return '/placeholder.svg';

  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Only inject if not already there
    if (!url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }
  }

  return url;
};
