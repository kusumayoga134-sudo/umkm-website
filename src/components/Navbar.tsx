'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Coffee, Menu, X, ShieldCheck, Home, Package, BookOpen, Star, Mail } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform shrink-0">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-brand-100" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 font-serif leading-none">
                  Karsa Rasa
                </span>
                <span className="text-xs sm:text-lg font-bold text-brand-600 font-serif leading-none">
                  Nusantara
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 hidden xs:flex">
                <p className="text-[10px] sm:text-[11px] text-gray-600 font-semibold tracking-wider uppercase">
                  Artisanal Kopi & Camilan UMKM
                </p>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Siap Kirim
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <Link href="/#beranda" className="hover:text-brand-600 transition-colors py-1">
              Beranda
            </Link>
            <Link href="/#katalog" className="hover:text-brand-600 transition-colors py-1">
              Katalog Produk
            </Link>
            <Link href="/#cerita" className="hover:text-brand-600 transition-colors py-1">
              Kisah Kami
            </Link>
            <Link href="/#testimoni" className="hover:text-brand-600 transition-colors py-1">
              Testimoni
            </Link>
            <Link href="/#kontak" className="hover:text-brand-600 transition-colors py-1">
              Kontak
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard shortcut (desktop) */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-900 bg-brand-100/80 hover:bg-brand-200/90 border border-brand-200/60 px-3.5 py-2 rounded-xl font-semibold transition shadow-xs"
              title="Dashboard Pengelola UMKM"
            >
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>Admin Toko</span>
            </Link>

            {/* Cart Trigger Button */}
            <button
              onClick={toggleCart}
              aria-label="Buka Keranjang Belanja"
              className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-brand-200/90 text-gray-800 hover:text-brand-600 hover:border-brand-400 hover:shadow-md transition duration-200 shadow-xs"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] sm:text-[11px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-gray-700 hover:text-brand-600 rounded-xl hover:bg-brand-100/50 transition focus:outline-none"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-brand-700 hover:bg-brand-50 transition"
          >
            <Home className="w-4 h-4 text-brand-600" /> Beranda
          </Link>
          <Link
            href="/#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-brand-700 hover:bg-brand-50 transition"
          >
            <Package className="w-4 h-4 text-brand-600" /> Katalog Produk
          </Link>
          <Link
            href="/#cerita"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-brand-700 hover:bg-brand-50 transition"
          >
            <BookOpen className="w-4 h-4 text-brand-600" /> Kisah Kami
          </Link>
          <Link
            href="/#testimoni"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-brand-700 hover:bg-brand-50 transition"
          >
            <Star className="w-4 h-4 text-brand-600" /> Testimoni Pelanggan
          </Link>
          <Link
            href="/#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-brand-700 hover:bg-brand-50 transition"
          >
            <Mail className="w-4 h-4 text-brand-600" /> Hubungi Kami
          </Link>

          <div className="pt-3 mt-2 border-t border-brand-100">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-sm transition"
            >
              <ShieldCheck className="w-4 h-4" /> Masuk Panel Admin Toko
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
