import { generateOrderNumber, generateWhatsAppOrderUrl } from '../src/lib/utils';
import { CartItem } from '../src/types';

describe('Order & WhatsApp Utilities', () => {
  it('should generate order number with correct KRS prefix and date format', () => {
    const fixedDate = new Date(2026, 10, 1); // 1 Nov 2026
    const orderNumber = generateOrderNumber(fixedDate);

    expect(orderNumber).toMatch(/^KRS-20261101-[A-Z0-9]{4}$/);
  });

  it('should generate a valid WhatsApp URL containing order details and recipient phone', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Kopi Arabika Gayo',
        price: 85000,
        quantity: 1,
        imageUrl: '/test.jpg',
        weight: '250 gram',
      },
    ];

    const orderData = {
      orderNumber: 'KRS-20261101-ABCD',
      customerName: 'Ahmad Fauzi',
      customerPhone: '081299887766',
      customerAddress: 'Jl. Malioboro No. 12, Yogyakarta',
      items,
      subtotal: 85000,
      shippingFee: 15000,
      grandTotal: 100000,
      paymentMethod: 'QRIS',
      notes: 'Biji kopi digiling medium',
    };

    const url = generateWhatsAppOrderUrl(orderData, '6281234567890');

    expect(url).toContain('https://wa.me/6281234567890?text=');
    const decodedUrl = decodeURIComponent(url);
    expect(decodedUrl).toContain('KRS-20261101-ABCD');
    expect(decodedUrl).toContain('Ahmad Fauzi');
    expect(decodedUrl).toContain('Kopi Arabika Gayo');
    expect(decodedUrl).toContain('Jl. Malioboro No. 12, Yogyakarta');
    expect(decodedUrl).toContain('QRIS');
  });
});
