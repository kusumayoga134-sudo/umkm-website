'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatRupiah, calculateCartTotals, generateWhatsAppOrderUrl } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Checkout form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');

  const { subtotal, shippingFee, grandTotal, isFreeShipping } = calculateCartTotals(items);

  if (!isOpen) return null;

  const handleSystemOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      toast.error('Mohon lengkapi nama, nomor telepon/WA, dan alamat!');
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
        toast.success('Pesanan Anda berhasil dibuat!');
      } else {
        toast.error(data.error || 'Gagal memproses pesanan.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!name || !phone || !address) {
      toast.error('Isi terlebih dahulu nama, nomor HP, dan alamat pengiriman!');
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-50/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-gray-900 font-serif text-lg">
              Keranjang Belanja
            </h3>
            <span className="text-xs bg-brand-200 text-brand-800 px-2 py-0.5 rounded-full font-bold">
              {items.length} item
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition"
            aria-label="Tutup Keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            /* Success confirmation */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 font-serif">
                Pesanan Berhasil Dicatat!
              </h4>
              <p className="text-xs text-gray-600">
                Nomor Pesanan:{' '}
                <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">
                  {orderSuccess.orderNumber}
                </span>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Terima kasih atas pesanan Anda di <strong>Karsa Rasa Nusantara</strong>. Kami akan segera menghubungi Anda untuk verifikasi pengiriman.
              </p>

              <div className="pt-4 space-y-2">
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
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
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
              <h4 className="font-bold text-gray-800">Keranjang Masih Kosong</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Belum ada produk pilihan yang ditambahkan. Silakan pilih produk UMKM favorit Anda di katalog!
              </p>
              <button
                onClick={closeCart}
                className="mt-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition"
              >
                Mulai Belanja
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form View */
            <form onSubmit={handleSystemOrder} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h4 className="text-sm font-bold text-gray-900">Formulir Pengiriman</h4>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-brand-600 hover:underline"
                >
                  ← Kembali ke Item
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Prasetyo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota & kode pos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  <option value="QRIS">QRIS (Gopay, OVO, Dana, ShopeePay, BCA)</option>
                  <option value="BANK_TRANSFER">Transfer Bank BCA / Mandiri</option>
                  <option value="COD">Cash on Delivery (Bayar di Tempat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Biji kopi digiling halus, atau titip satpam"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Catat Pesanan'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Langsung Kirim ke WhatsApp
                </button>
              </div>
            </form>
          ) : (
            /* Items list */
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{item.weight}</p>
                  <p className="text-xs font-semibold text-brand-700 mt-0.5">
                    {formatRupiah(item.price)}
                  </p>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Hapus"
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
          <div className="p-5 border-t border-gray-100 bg-white space-y-3">
            {/* Free shipping banner */}
            <div className="text-[11px] px-3 py-1.5 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-between border border-brand-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                {isFreeShipping ? 'Gratis Ongkir Aktif!' : 'Min. Rp 200rb untuk Bebas Ongkir'}
              </span>
              <span className="font-bold">
                {isFreeShipping ? 'Rp 0' : formatRupiah(shippingFee)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkos Kirim</span>
                <span>{shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Belanja</span>
                <span className="text-brand-700">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition"
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
