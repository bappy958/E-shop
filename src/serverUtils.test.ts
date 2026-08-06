import { describe, expect, it } from 'vitest';
import { sanitizeText, toNumberOrDefault, toSlug } from './serverUtils';

describe('serverUtils', () => {
  it('sanitizes empty strings to fallback', () => {
    expect(sanitizeText('   ', 'fallback')).toBe('fallback');
    expect(sanitizeText(undefined, 'fallback')).toBe('fallback');
  });

  it('converts values into slugs', () => {
    expect(toSlug('Luxury Panjabi', 'product')).toBe('luxury-panjabi');
    expect(toSlug('   ', 'product')).toBe('product');
  });

  it('coerces numeric values safely', () => {
    expect(toNumberOrDefault('42', 0)).toBe(42);
    expect(toNumberOrDefault('abc', 7)).toBe(7);
  });
});
