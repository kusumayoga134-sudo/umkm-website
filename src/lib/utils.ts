import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem, Product } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 85000 -> "Rp 85.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate unique order number with date prefix
 * e.g. KRS-20261101-AB12
 */
export function generateOrderNumber(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KRS-${yyyy}${mm}${dd}-${randomStr}`;
}

/**
 * Calculate totals for cart items
 */
export function calculateCartTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Free shipping for subtotal >= 200,000, otherwise flat 15,000
  const shippingFee = subtotal >= 200000 || subtotal === 0 ? 0 : 15000;
  const grandTotal = subtotal + shippingFee;

  return {
    totalItems,
    subtotal,
    shippingFee,
    grandTotal,
    isFreeShipping: subtotal >= 200000 && subtotal > 0,
  };
}

/**
 * Generate formatted WhatsApp message and click-to-chat URL
 */
export function generateWhatsAppOrderUrl(
  order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    grandTotal: number;
    paymentMethod: string;
    notes?: string;
  },
  adminPhone: string = '6281234567890'
): string {
  const cleanPhone = adminPhone.replace(/[^0-9]/g, '');

  let itemLines = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (${item.weight})\n   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(
          item.price * item.quantity
        )}`
    )
    .join('\n');

  const text = `Halo Admin *Karsa Rasa Nusantara*! 🌿
Saya ingin mengonfirmasi pemesanan saya:

*No. Pesanan:* ${order.orderNumber}
*Nama:* ${order.customerName}
*No. HP/WA:* ${order.customerPhone}
*Alamat Pengiriman:*
${order.customerAddress}

*Daftar Produk:*
${itemLines}

---------------------------------
*Subtotal:* ${formatRupiah(order.subtotal)}
*Ongkir:* ${order.shippingFee === 0 ? 'GRATIS' : formatRupiah(order.shippingFee)}
*Total Pembayaran:* *${formatRupiah(order.grandTotal)}*
*Metode Pembayaran:* ${order.paymentMethod}
${order.notes ? `*Catatan Khusus:* ${order.notes}\n` : ''}
Mohon konfirmasi dan info nomor rekening / QRIS untuk penyelesaian transaksi. Terima kasih! 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Filter and sort products
 */
export function filterProducts(
  products: Product[],
  searchQuery: string = '',
  categorySlug: string = 'all',
  sortBy: string = 'featured'
): Product[] {
  let result = [...products];

  // Category filter
  if (categorySlug && categorySlug !== 'all') {
    result = result.filter(
      (p) => p.category?.slug === categorySlug || (p as any).categorySlug === categorySlug
    );
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.weight.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default featured first, then newest
    result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return result;
}
