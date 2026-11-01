'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Package, ShoppingBag, Clock, DollarSign, ArrowUpRight, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resStats, resOrders] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
      ]);

      const dataStats = await resStats.json();
      const dataOrders = await resOrders.json();

      if (dataStats.success) setStats(dataStats.data);
      if (dataOrders.success) setRecentOrders(dataOrders.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Menunggu Konfirmasi
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" /> Sedang Diproses
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
            <Truck className="w-3 h-3" /> Dalam Pengiriman
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">
              Dashboard Pengelola UMKM
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Pantau performa penjualan, ketersediaan produk, dan status pesanan konsumen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              + Tambah Produk Baru
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Omset Penjualan</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {stats ? formatRupiah(stats.totalRevenue) : 'Rp ...'}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Pesanan</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {stats ? `${stats.totalOrders} Transaksi` : '...'}
              </h3>
            </div>
            <div className="p-3 bg-brand-100 text-brand-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Perlu Diproses</p>
              <h3 className="text-xl font-extrabold text-amber-600 mt-1">
                {stats ? `${stats.pendingOrders} Pesanan` : '...'}
              </h3>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Katalog Produk Aktif</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {stats ? `${stats.totalProducts} Item` : '...'}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-gray-500">5 transaksi terakhir yang dibuat pelanggan</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Lihat Semua Pesanan <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">No. Pesanan</th>
                  <th className="px-5 py-3">Nama Pemesan</th>
                  <th className="px-5 py-3">Item Dipesan</th>
                  <th className="px-5 py-3">Total Belanja</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      Memuat data pesanan...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-[11px] text-gray-400">{order.customerPhone}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {order.items?.map((it: any) => (
                          <div key={it.id} className="text-gray-600">
                            {it.quantity}x {it.productName}
                          </div>
                        ))}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-brand-700">
                        {formatRupiah(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3.5">{getStatusBadge(order.status)}</td>
                      <td className="px-5 py-3.5 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
