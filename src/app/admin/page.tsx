'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Package, ShoppingBag, Clock, DollarSign, ArrowUpRight, CheckCircle2, Truck, Plus, Sparkles, TrendingUp, MessageSquare, ExternalLink } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" /> Diproses
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3" /> Dikirim
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner with Online Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs ambient-glow">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Toko Online Aktif & Siap Menerima Pesanan</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Dashboard Pengelola Toko
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Pantau performa omset, ketersediaan stok, dan proses pemenuhan pesanan pelanggan.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <Link
              href="/admin/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-700/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards: 2 Columns on Mobile, 4 Columns on PC */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {/* Revenue */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500">Omset Penjualan</span>
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-base sm:text-xl font-extrabold text-gray-900 truncate font-serif">
                {stats ? formatRupiah(stats.totalRevenue) : 'Rp ...'}
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% bulan ini</span>
              </p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500">Total Pesanan</span>
              <div className="p-2 bg-brand-100 text-brand-700 rounded-xl shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-base sm:text-xl font-extrabold text-gray-900 truncate font-serif">
                {stats ? `${stats.totalOrders} Transaksi` : '...'}
              </h3>
              <p className="text-[10px] text-brand-700 font-semibold mt-1">
                99.2% terpenuhi
              </p>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500">Perlu Diproses</span>
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-base sm:text-xl font-extrabold text-amber-700 truncate font-serif">
                {stats ? `${stats.pendingOrders} Pesanan` : '...'}
              </h3>
              <p className="text-[10px] text-amber-700 font-semibold mt-1">
                Prioritas hari ini
              </p>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-semibold text-gray-500">Katalog Aktif</span>
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-base sm:text-xl font-extrabold text-gray-900 truncate font-serif">
                {stats ? `${stats.totalProducts} Item` : '...'}
              </h3>
              <p className="text-[10px] text-blue-700 font-semibold mt-1">
                Semua siap dikirim
              </p>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Pills */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/admin/products"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-brand-200/70 hover:border-brand-400 hover:shadow-xs transition text-center flex flex-col sm:flex-row items-center justify-center gap-2 group"
          >
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800">Kelola Produk</span>
          </Link>

          <Link
            href="/admin/orders"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-brand-200/70 hover:border-brand-400 hover:shadow-xs transition text-center flex flex-col sm:flex-row items-center justify-center gap-2 group"
          >
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800">Daftar Pesanan</span>
          </Link>

          <Link
            href="/admin/messages"
            className="p-3 sm:p-4 rounded-2xl bg-white border border-brand-200/70 hover:border-brand-400 hover:shadow-xs transition text-center flex flex-col sm:flex-row items-center justify-center gap-2 group"
          >
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-800">Kotak Pesan</span>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-brand-100 flex items-center justify-between bg-brand-50/40">
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base font-serif">
                Pesanan Terbaru Masuk
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500">
                5 transaksi terbaru yang dibuat oleh pembeli
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 shrink-0"
            >
              <span>Kelola Pesanan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-50/60 text-gray-600 uppercase tracking-wider font-semibold border-b border-brand-100">
                <tr>
                  <th className="px-5 py-3">No. Pesanan</th>
                  <th className="px-5 py-3">Nama Pemesan</th>
                  <th className="px-5 py-3">Item Dipesan</th>
                  <th className="px-5 py-3">Total Belanja</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Waktu</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                      Memuat data pesanan...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-50/30 transition">
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
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Halo Kak ${order.customerName}, kami dari UMKM Karsa Rasa mengabari pesanan #${order.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition"
                          title="Chat WA Pembeli"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>Chat WA</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Order Cards View */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Memuat pesanan...</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">Belum ada pesanan masuk.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-sm text-gray-900">{order.customerName}</h4>
                    <span className="text-xs font-extrabold text-brand-700 font-serif">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 bg-brand-50/40 p-2.5 rounded-xl border border-brand-100/60">
                    {order.items?.map((it: any) => (
                      <div key={it.id} className="truncate">
                        • {it.quantity}x {it.productName}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>{order.customerPhone}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Kak ${order.customerName}, kami dari UMKM Karsa Rasa mengabari pesanan #${order.orderNumber}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      >
                        <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Chat WA</span>
                      </a>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
