'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Order } from '@/types';
import { Search, Phone, MapPin, MessageSquare, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      toast.error('Gagal memuat daftar pesanan', { id: 'admin-orders-load' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status pesanan diubah ke ${newStatus}`, { id: `admin-order-status-${orderId}` });
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      } else {
        toast.error(data.error || 'Gagal mengubah status', { id: `admin-order-status-err` });
      }
    } catch (e) {
      toast.error('Terjadi kesalahan jaringan', { id: `admin-order-status-net` });
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner */}
        <div className="mb-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Manajemen Transaksi</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
            Daftar Pesanan Konsumen
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola detail pesanan, pantau alamat pengiriman, dan perbarui proses logistik pesanan.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-brand-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor pesanan, nama, no HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-0.5 touch-pan-x">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-xs'
                      : 'bg-brand-50/60 text-gray-700 border border-brand-200/70 hover:bg-brand-100 hover:text-brand-800'
                  }`}
                >
                  {status === 'ALL'
                    ? 'Semua'
                    : status === 'PENDING'
                    ? 'Menunggu'
                    : status === 'PROCESSING'
                    ? 'Diproses'
                    : status === 'SHIPPED'
                    ? 'Dikirim'
                    : status === 'COMPLETED'
                    ? 'Selesai'
                    : 'Batal'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-brand-200/80">
              Memuat data pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-brand-200/80">
              Tidak ada pesanan ditemukan dengan kriteria tersebut.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs flex flex-col lg:flex-row justify-between gap-5 sm:gap-6"
              >
                {/* Left: Customer & Address */}
                <div className="space-y-2.5 sm:space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs sm:text-sm text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                      {order.orderNumber}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{order.customerName}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
                      <span className="flex items-center gap-1 font-medium text-emerald-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {order.customerPhone}
                        </a>
                      </span>
                      <span>Metode: <strong className="text-gray-800">{order.paymentMethod}</strong></span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 flex items-start gap-1.5 bg-gray-50 p-2.5 sm:p-3 rounded-xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed">{order.customerAddress}</p>
                      {order.deliveryNotes && (
                        <p className="text-gray-400 italic mt-0.5">
                          Catatan: {order.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Items List */}
                <div className="w-full lg:w-72 bg-brand-50/40 p-3.5 rounded-xl sm:rounded-2xl border border-brand-100 space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Daftar Produk
                  </h4>
                  <div className="divide-y divide-brand-100 max-h-36 overflow-y-auto pr-1 text-xs">
                    {order.items?.map((it) => (
                      <div key={it.id} className="py-1.5 flex justify-between">
                        <span className="text-gray-800 line-clamp-1 mr-2">
                          {it.quantity}x {it.productName}
                        </span>
                        <span className="font-bold text-gray-900 shrink-0">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-brand-200/60 flex justify-between text-xs font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-brand-700 font-extrabold">{formatRupiah(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Right: Status Action Control */}
                <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3 min-w-[170px] pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] sm:text-[11px] text-gray-400 mb-1">Status Pesanan:</div>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.status === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : order.status === 'SHIPPED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : order.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="PENDING">PENDING (Menunggu)</option>
                      <option value="PROCESSING">PROCESSING (Diproses)</option>
                      <option value="SHIPPED">SHIPPED (Dikirim)</option>
                      <option value="COMPLETED">COMPLETED (Selesai)</option>
                      <option value="CANCELLED">CANCELLED (Batal)</option>
                    </select>
                  </div>

                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Kak ${order.customerName}, kami dari UMKM Karsa Rasa ingin mengonfirmasi pesanan #${order.orderNumber} dengan total ${formatRupiah(order.totalAmount)}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hubungi WA</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
