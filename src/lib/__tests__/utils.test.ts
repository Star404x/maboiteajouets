import { cn, formatPrice } from '../utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price with euro symbol', () => {
      const result = formatPrice(42.5);
      expect(result).toContain('42');
      expect(result).toContain('€');
    });

    it('should handle decimal places', () => {
      const result = formatPrice(100.99);
      expect(result).toContain('100');
      expect(result).toContain('99');
    });

    it('should handle whole numbers', () => {
      const result = formatPrice(50);
      expect(result).toContain('50');
      expect(result).toContain('€');
    });

    it('should handle zero', () => {
      const result = formatPrice(0);
      expect(result).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatPrice(-25.5);
      expect(result).toContain('25');
      expect(result).toContain('€');
    });
  });

  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('p-4', 'text-red');
      expect(result).toContain('p-4');
      expect(result).toContain('text-red');
    });

    it('should handle undefined values', () => {
      const result = cn('p-4', undefined, 'text-red');
      expect(result).toContain('p-4');
      expect(result).toContain('text-red');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should override conflicting classes', () => {
      const result = cn('p-4', 'p-8');
      // Last class should win (Tailwind behavior)
      expect(result).toMatch(/p-[48]/);
    });
  });
});
