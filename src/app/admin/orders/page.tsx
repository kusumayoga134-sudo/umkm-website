'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Order } from '@/types';
import { Search, Filter, Phone, MapPin, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Manajemen Pesanan Masuk
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Lihat detail pesanan pelanggan, alamat pengiriman, dan perbarui proses pemenuhan pesanan.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor pesanan, nama pemesan, no HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === status
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">
              Memuat data pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">
              Tidak ada pesanan ditemukan dengan kriteria tersebut.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Left: Customer & Address */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">{order.customerName}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-600 underline font-medium"
                        >
                          {order.customerPhone}
                        </a>
                      </span>
                      <span>Metode: <strong>{order.paymentMethod}</strong></span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 flex items-start gap-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p>{order.customerAddress}</p>
                      {order.deliveryNotes && (
                        <p className="text-gray-400 italic mt-0.5">
                          Catatan: {order.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Items List */}
                <div className="w-full lg:w-72 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Daftar Produk
                  </h4>
                  <div className="divide-y divide-gray-200/60 max-h-36 overflow-y-auto pr-1">
                    {order.items?.map((it) => (
                      <div key={it.id} className="py-1.5 flex justify-between text-xs">
                        <span className="text-gray-800">
                          {it.quantity}x {it.productName}
                        </span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-brand-700">{formatRupiah(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Right: Status Action Control */}
                <div className="flex lg:flex-col justify-between items-end gap-3 min-w-[160px]">
                  <div className="text-right">
                    <div className="text-[11px] text-gray-400 mb-1">Status Pesanan:</div>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <span>Hubungi Pelanggan</span>
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
