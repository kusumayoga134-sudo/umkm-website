'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatRupiah, calculateCartTotals, generateWhatsAppOrderUrl } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, CheckCircle, ShieldCheck, QrCode, CreditCard, Truck, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Checkout form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');

  const { subtotal, shippingFee, grandTotal, isFreeShipping } = calculateCartTotals(items);
  const freeShippingThreshold = 200000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (!isOpen) return null;

  const handleSystemOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Mohon lengkapi nama, nomor telepon/WA, dan alamat!', {
        id: 'order-validation',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email || null,
          customerAddress: address,
          deliveryNotes: notes || null,
          paymentMethod,
          items,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.data);
        clearCart();
        toast.success('Pesanan Anda berhasil dibuat!', {
          id: 'order-success',
        });
      } else {
        toast.error(data.error || 'Gagal memproses pesanan.', {
          id: 'order-error',
        });
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.', {
        id: 'order-network',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!name || !phone || !address) {
      toast.error('Isi terlebih dahulu nama, nomor HP, dan alamat pengiriman!', {
        id: 'wa-validation',
      });
      return;
    }

    const waUrl = generateWhatsAppOrderUrl(
      {
        orderNumber: orderSuccess?.orderNumber || 'DRAFT-' + Date.now().toString().slice(-4),
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        items,
        subtotal,
        shippingFee,
        grandTotal,
        paymentMethod,
        notes,
      },
      process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890'
    );

    window.open(waUrl, '_blank');
  };

  const copyOrderNumber = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopied(true);
    toast.success('Nomor pesanan disalin ke clipboard!', { id: 'copy-order' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-brand-100 flex items-center justify-between bg-brand-50/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-600 text-white rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 font-serif text-base sm:text-lg">
              Keranjang Belanja
            </h3>
            <span className="text-[10px] sm:text-xs bg-brand-200 text-brand-900 px-2 py-0.5 rounded-full font-bold">
              {items.length} item
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-brand-100 text-gray-500 hover:text-gray-900 transition"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Visual Progress Bar */}
        {items.length > 0 && !orderSuccess && (
          <div className="bg-brand-50/80 px-4 py-2.5 border-b border-brand-200/60">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-brand-900 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-700" />
                {isFreeShipping ? '🎉 Bebas Ongkir Aktif!' : `Tambah ${formatRupiah(remainingForFreeShipping)} lagi`}
              </span>
              <span className="font-extrabold text-brand-800">
                {isFreeShipping ? 'GRATIS' : `${freeShippingPercent}%`}
              </span>
            </div>
            <div className="w-full bg-brand-200/70 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFreeShipping ? 'bg-emerald-600' : 'bg-brand-600'
                }`}
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {orderSuccess ? (
            /* Success confirmation */
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 font-serif">
                Pesanan Berhasil Dicatat!
              </h4>

              <div className="bg-brand-50 p-3.5 rounded-2xl border border-brand-200 flex items-center justify-between gap-2 max-w-xs mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Nomor Pesanan</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-brand-800">
                    {orderSuccess.orderNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyOrderNumber(orderSuccess.orderNumber)}
                  className="p-2 rounded-xl bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 transition shadow-2xs"
                  title="Salin nomor pesanan"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Terima kasih atas pesanan Anda di <strong>Karsa Rasa Nusantara</strong>. Konfirmasikan pesanan Anda langsung ke WhatsApp admin kami untuk penyelesaian pengiriman.
              </p>

              <div className="pt-2 space-y-2">
                <a
                  href={generateWhatsAppOrderUrl(
                    {
                      orderNumber: orderSuccess.orderNumber,
                      customerName: orderSuccess.customerName,
                      customerPhone: orderSuccess.customerPhone,
                      customerAddress: orderSuccess.customerAddress,
                      items: orderSuccess.items || [],
                      subtotal: orderSuccess.totalAmount,
                      shippingFee: 0,
                      grandTotal: orderSuccess.totalAmount,
                      paymentMethod: orderSuccess.paymentMethod,
                      notes: orderSuccess.deliveryNotes,
                    },
                    process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <MessageSquare className="w-4 h-4" /> Konfirmasi ke WhatsApp Admin
                </a>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCheckingOut(false);
                    closeCart();
                  }}
                  className="w-full py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Selesai & Belanja Lagi
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-800 text-base">Keranjang Masih Kosong</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Belum ada produk pilihan yang ditambahkan. Silakan pilih kopi atau kudapan UMKM favorit Anda!
              </p>
              <button
                onClick={closeCart}
                className="mt-2 text-xs font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 px-4 py-2 rounded-xl transition shadow-2xs"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form View */
            <form onSubmit={handleSystemOrder} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">Formulir Pengiriman</h4>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  ← Lihat Item
                </button>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Prasetyo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-brand-50/20"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-brand-50/20"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota & kode pos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-brand-50/20"
                />
              </div>

              {/* Payment Method Selector Pills */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1.5">
                  Pilih Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'QRIS'
                        ? 'bg-brand-50 border-brand-600 text-brand-900 font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-brand-600" />
                    <span className="text-[10px]">QRIS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'bg-brand-50 border-brand-600 text-brand-900 font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-brand-600" />
                    <span className="text-[10px]">Transfer Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'COD'
                        ? 'bg-brand-50 border-brand-600 text-brand-900 font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-brand-600" />
                    <span className="text-[10px]">COD</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Giling halus, titip satpam"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-brand-50/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Catat Pesanan'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Langsung Kirim ke WhatsApp Admin
                </button>
              </div>
            </form>
          ) : (
            /* Items list */
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50/40 border border-brand-100"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-white shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-500">{item.weight}</p>
                  <p className="text-xs font-bold text-brand-700 mt-0.5">
                    {formatRupiah(item.price)}
                  </p>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center border border-brand-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Hapus"
                      aria-label="Hapus produk dari keranjang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with calculation */}
        {!orderSuccess && items.length > 0 && !isCheckingOut && (
          <div className="p-4 sm:p-5 border-t border-brand-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkos Kirim</span>
                <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                  {shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-brand-100 font-serif">
                <span>Total Belanja</span>
                <span className="text-brand-700">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-700/20 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
