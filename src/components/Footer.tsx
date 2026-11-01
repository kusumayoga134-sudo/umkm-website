'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Heart, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100 pt-16 pb-12 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-900/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-700 flex items-center justify-center text-white shadow-md">
                <Coffee className="w-5 h-5 text-brand-200" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-wide">
                Karsa Rasa <span className="text-brand-400">Nusantara</span>
              </span>
            </div>
            <p className="text-xs text-brand-300 leading-relaxed max-w-sm">
              Platform dan toko online produk UMKM lokal Indonesia. Menyajikan biji kopi artisan, camilan sehat tanpa bahan pengawet, dan sambal autentik langsung dari para pengrajin.
            </p>
            <div className="flex items-center gap-3 text-brand-300 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-brand-900/80 hover:bg-brand-800 hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-brand-900/80 hover:bg-brand-800 hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-brand-300">
              <li>
                <Link href="/#beranda" className="hover:text-white transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-white transition">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/#cerita" className="hover:text-white transition">
                  Kisah Kami
                </Link>
              </li>
              <li>
                <Link href="/#testimoni" className="hover:text-white transition">
                  Testimoni Pelanggan
                </Link>
              </li>
              <li>
                <Link href="/#kontak" className="hover:text-white transition">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kategori Produk
            </h4>
            <ul className="space-y-2 text-xs text-brand-300">
              <li>
                <Link href="/#katalog" className="hover:text-white transition">
                  Kopi Nusantara
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-white transition">
                  Camilan Sehat
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-white transition">
                  Sambal & Bumbu
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="hover:text-white transition">
                  Hampers & Kado
                </Link>
              </li>
            </ul>
          </div>

          {/* Pengelola UMKM */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Pengelola Toko
            </h4>
            <p className="text-xs text-brand-300 leading-relaxed">
              Masuk ke dashboard untuk mengelola stok produk, melihat pesanan baru, dan memantau omset harian.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-xs font-semibold text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Buka Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-400 gap-4">
          <p>© {currentYear} Karsa Rasa Nusantara. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk Kemajuan UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
