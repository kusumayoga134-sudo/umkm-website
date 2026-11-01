'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Coffee, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6 text-brand-100" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5 font-serif">
                Karsa Rasa <span className="text-brand-600">Nusantara</span>
              </span>
              <p className="text-[11px] text-gray-700 font-medium tracking-wide uppercase">
                Artisanal Kopi & Camilan UMKM
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="/#beranda" className="hover:text-brand-600 transition-colors">
              Beranda
            </Link>
            <Link href="/#katalog" className="hover:text-brand-600 transition-colors">
              Katalog Produk
            </Link>
            <Link href="/#cerita" className="hover:text-brand-600 transition-colors">
              Kisah Kami
            </Link>
            <Link href="/#testimoni" className="hover:text-brand-600 transition-colors">
              Testimoni
            </Link>
            <Link href="/#kontak" className="hover:text-brand-600 transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Dashboard shortcut */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-800 bg-brand-100/70 hover:bg-brand-200 px-3 py-1.5 rounded-full font-medium transition"
              title="Dashboard Pengelola UMKM"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>Admin UMKM</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              aria-label="Buka Keranjang Belanja"
              className="relative p-2.5 rounded-full bg-white border border-brand-200 text-gray-800 hover:text-brand-600 hover:border-brand-400 hover:shadow-md transition duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-gray-700 hover:text-brand-600 focus:outline-none"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-200 bg-white/95 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-brand-600"
          >
            Beranda
          </Link>
          <Link
            href="/#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-brand-600"
          >
            Katalog Produk
          </Link>
          <Link
            href="/#cerita"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-brand-600"
          >
            Kisah Kami
          </Link>
          <Link
            href="/#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-brand-600"
          >
            Testimoni Pelanggan
          </Link>
          <Link
            href="/#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-brand-600"
          >
            Hubungi Kami
          </Link>
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-brand-700"
            >
              <ShieldCheck className="w-4 h-4" /> Masuk Panel Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
