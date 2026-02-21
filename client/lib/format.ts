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
  if (value === null || value === undefined || value === '') return '';

  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  if (isNaN(num)) return String(value);

  return new Intl.NumberFormat('vi-VN').format(num) + ' Đ';
};
