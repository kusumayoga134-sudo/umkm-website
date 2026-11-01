import { formatRupiah } from '../src/lib/utils';

describe('formatRupiah Utility', () => {
  it('should correctly format standard Indonesian Rupiah numbers', () => {
    const formatted = formatRupiah(85000);
    // Replace non-breaking spaces for cross-platform test consistency
    const sanitized = formatted.replace(/\s+/g, ' ');
    expect(sanitized).toMatch(/Rp\s?85\.000/);
  });

  it('should format zero correctly', () => {
    const formatted = formatRupiah(0);
    const sanitized = formatted.replace(/\s+/g, ' ');
    expect(sanitized).toMatch(/Rp\s?0/);
  });

  it('should handle large amounts correctly', () => {
    const formatted = formatRupiah(1500000);
    const sanitized = formatted.replace(/\s+/g, ' ');
    expect(sanitized).toMatch(/Rp\s?1\.500\.000/);
  });

  it('should return Rp 0 when NaN is passed', () => {
    expect(formatRupiah(NaN)).toBe('Rp 0');
  });
});
