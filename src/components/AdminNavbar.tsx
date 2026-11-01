'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, Package, ShoppingCart, MessageSquare, ArrowLeft } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produk & Stok', icon: Package },
    { href: '/admin/orders', label: 'Daftar Pesanan', icon: ShoppingCart },
    { href: '/admin/messages', label: 'Pesan Masuk', icon: MessageSquare },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-600 text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Website</span>
            </Link>

            <div className="h-4 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-900 text-sm font-serif">
                Panel Admin UMKM
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-brand-100 text-brand-800 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
