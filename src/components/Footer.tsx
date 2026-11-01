'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Heart, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100 pt-12 sm:pt-16 pb-14 sm:pb-12 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-brand-900/60">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md">
                <Coffee className="w-5 h-5 text-brand-200" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                Karsa Rasa <span className="text-brand-400">Nusantara</span>
              </span>
            </div>
            <p className="text-xs text-brand-300 leading-relaxed max-w-sm">
              Platform toko online produk UMKM Indonesia. Menyajikan biji kopi artisan, camilan sehat tanpa bahan pengawet, dan sambal rempah warisan leluhur.
            </p>
            <div className="flex items-center gap-2.5 text-brand-300 pt-1">
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-1.5 text-xs text-brand-300">
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kategori Produk
            </h4>
            <ul className="space-y-1.5 text-xs text-brand-300">
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

          {/* Admin UMKM */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Pengelola Toko
            </h4>
            <p className="text-xs text-brand-300 leading-relaxed">
              Masuk ke panel untuk kelola stok, pantau pesanan baru, dan lihat omset harian.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-xs font-semibold text-white transition mt-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Buka Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-brand-400 gap-3 text-center sm:text-left">
          <p>© {currentYear} Karsa Rasa Nusantara. Seluruh Hak Cipta Dilindungi.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk Kemajuan UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
