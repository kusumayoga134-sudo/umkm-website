'use client';

import React, { useEffect, useState, useRef } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Order } from '@/types';
import { Search, Phone, MapPin, MessageSquare, Sparkles, X, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderStatusDropdownProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
}

function OrderStatusDropdown({ status, onStatusChange }: OrderStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'PENDING', label: 'PENDING (Menunggu)', dot: 'bg-amber-500' },
    { value: 'PROCESSING', label: 'PROCESSING (Diproses)', dot: 'bg-blue-500' },
    { value: 'SHIPPED', label: 'SHIPPED (Dikirim)', dot: 'bg-purple-500' },
    { value: 'COMPLETED', label: 'COMPLETED (Selesai)', dot: 'bg-emerald-500' },
    { value: 'CANCELLED', label: 'CANCELLED (Batal)', dot: 'bg-rose-500' },
  ];

  const currentOption = options.find((opt) => opt.value === status) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border shadow-2xs ${
          isOpen
            ? 'bg-brand-50 text-brand-900 border-brand-400 ring-2 ring-brand-200'
            : 'bg-white text-gray-800 border-brand-200 hover:border-brand-300 hover:bg-brand-50/50'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${currentOption.dot}`} />
          <span className="truncate">{currentOption.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-brand-700 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1.5 sm:bottom-auto sm:top-full sm:mt-1.5 w-full min-w-[210px] bg-white/98 backdrop-blur-md border border-brand-200/90 shadow-xl rounded-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-brand-100 mb-1">
            Ubah Status Pesanan
          </div>
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onStatusChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition text-left ${
                    isSelected
                      ? 'bg-brand-100/90 text-brand-900 font-bold'
                      : 'text-gray-700 hover:bg-brand-50 hover:text-brand-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" /> Sedang Diproses
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3" /> Dalam Pengiriman
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner */}
        <div className="mb-6 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs ambient-glow">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Manajemen Transaksi & Logistik</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
            Daftar Pesanan Konsumen
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola detail transaksi, perbarui status pengiriman barang, dan hubungi pelanggan via WhatsApp.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no pesanan, nama, no HP..."
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
            {[
              { id: 'ALL', label: 'Semua Pesanan' },
              { id: 'PENDING', label: 'Menunggu' },
              { id: 'PROCESSING', label: 'Diproses' },
              { id: 'SHIPPED', label: 'Dikirim' },
              { id: 'COMPLETED', label: 'Selesai' },
              { id: 'CANCELLED', label: 'Batal' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-xs'
                    : 'bg-brand-50/60 text-gray-700 border border-brand-200/70 hover:bg-brand-100 hover:text-brand-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
            filteredOrders.map((order) => {
              const waMessage = `Halo Kak ${order.customerName}, kami dari pengelola UMKM Karsa Rasa ingin mengonfirmasi pesanan #${order.orderNumber} (Status: ${order.status}) dengan total ${formatRupiah(order.totalAmount)}. Terima kasih telah mendukung produk UMKM kami!`;

              return (
                <div
                  key={order.id}
                  className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs flex flex-col lg:flex-row justify-between gap-5 sm:gap-6 hover:shadow-md transition"
                >
                  {/* Left: Customer & Address */}
                  <div className="space-y-2.5 sm:space-y-3 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs sm:text-sm text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
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
                        <span>
                          Pembayaran: <strong className="text-gray-800">{order.paymentMethod}</strong>
                        </span>
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
                    <h4 className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
                      <span>Rincian Produk ({order.items?.length || 0})</span>
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
                      <span>Total Transaksi</span>
                      <span className="text-brand-700 font-extrabold">{formatRupiah(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex flex-col justify-between items-start lg:items-end gap-3 min-w-[190px] pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                    <div className="w-full text-left lg:text-right space-y-1.5">
                      <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        Ubah Alur Status:
                      </div>
                      
                      {/* One-click fast progression buttons */}
                      <div className="flex flex-wrap lg:justify-end gap-1">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
                          >
                            Proses Pesanan
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
                          >
                            Kirim Paket
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
                          >
                            Tandai Selesai
                          </button>
                        )}
                      </div>

                      {/* Custom Elegant Status Popover Dropdown */}
                      <OrderStatusDropdown
                        status={order.status}
                        onStatusChange={(newStatus) => handleUpdateStatus(order.id, newStatus)}
                      />
                    </div>

                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-98"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Pembeli di WA</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
