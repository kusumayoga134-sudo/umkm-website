import { calculateCartTotals } from '../src/lib/utils';
import { CartItem } from '../src/types';

describe('calculateCartTotals Utility', () => {
  it('should return 0 totals for empty cart', () => {
    const result = calculateCartTotals([]);
    expect(result.totalItems).toBe(0);
    expect(result.subtotal).toBe(0);
    expect(result.shippingFee).toBe(0);
    expect(result.grandTotal).toBe(0);
    expect(result.isFreeShipping).toBe(false);
  });

  it('should calculate subtotal and add shipping fee if under Rp 200.000', () => {
    const mockItems: CartItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Kopi Gayo',
        price: 85000,
        quantity: 2, // 170.000
        imageUrl: '/test.jpg',
        weight: '250g',
      },
    ];

    const result = calculateCartTotals(mockItems);
    expect(result.totalItems).toBe(2);
    expect(result.subtotal).toBe(170000);
    expect(result.shippingFee).toBe(15000);
    expect(result.grandTotal).toBe(185000);
    expect(result.isFreeShipping).toBe(false);
  });

  it('should grant free shipping if subtotal is equal to or exceeds Rp 200.000', () => {
    const mockItems: CartItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Kopi Gayo',
        price: 85000,
        quantity: 2, // 170.000
        imageUrl: '/test.jpg',
        weight: '250g',
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'Keripik Pisang',
        price: 38000,
        quantity: 1, // 38.000 -> Total 208.000
        imageUrl: '/test2.jpg',
        weight: '200g',
      },
    ];

    const result = calculateCartTotals(mockItems);
    expect(result.totalItems).toBe(3);
    expect(result.subtotal).toBe(208000);
    expect(result.shippingFee).toBe(0);
    expect(result.grandTotal).toBe(208000);
    expect(result.isFreeShipping).toBe(true);
  });
});
