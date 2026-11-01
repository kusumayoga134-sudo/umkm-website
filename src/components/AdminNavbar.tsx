'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, Package, ShoppingCart, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produk & Stok', icon: Package },
    { href: '/admin/orders', label: 'Pesanan Masuk', icon: ShoppingCart },
    { href: '/admin/messages', label: 'Pesan & Mitra', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 border-b border-brand-200/40 md:border-b-0">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 shrink-0">
              <Coffee className="w-5 h-5 text-brand-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold font-serif text-gray-900 tracking-tight">
                Karsa Rasa
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md border border-brand-200">
                Panel Admin
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-gray-700 hover:text-brand-700 hover:bg-brand-100/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Exit / View Store Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-brand-50 hover:text-brand-700 border border-brand-200 shadow-2xs transition active:scale-95 shrink-0"
            title="Buka Website Pengunjung"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-600" />
            <span>Lihat Toko</span>
          </Link>
        </div>

        {/* Mobile Horizontal Sub-Navigation Tab Bar */}
        <div className="md:hidden py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-gray-700 bg-white/70 border border-brand-200/60 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
