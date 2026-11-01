'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export default function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-200/40 via-brand-100/20 to-transparent -z-10 rounded-b-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold uppercase tracking-wider shadow-sm border border-brand-200">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Bangga Buatan Indonesia • Kualitas Terbaik</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] font-serif">
              Otentikasi Rasa <span className="text-brand-600 underline decoration-brand-300 decoration-wavy decoration-2">Nusantara</span> Langsung ke Rumah Anda.
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Kami menghadirkan biji kopi sangrai pilihan petani lokal, kudapan sehat tanpa bahan pengawet, dan sambal warisan rempah alami. Mendukung ekonomi UMKM dengan cita rasa kelas dunia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-600/25 transition duration-200 group"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890'}?text=${encodeURIComponent(
                  'Halo Karsa Rasa Nusantara, saya ingin bertanya tentang produk dan cara pemesanan.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-brand-50 text-gray-800 font-semibold border border-brand-300 shadow-sm transition duration-200"
              >
                <span>Konsultasi via WA</span>
              </a>
            </div>

            {/* Badges / Value props */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-200/80 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">100% Petani</h4>
                  <p className="text-[11px] text-gray-500">Lokal Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Alami & Halal</h4>
                  <p className="text-[11px] text-gray-500">Bebas Pengawet</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Kirim Cepat</h4>
                  <p className="text-[11px] text-gray-500">Packing Ekstra Aman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Imagery with overlay floating cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white bg-brand-100 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                  alt="Kopi & Kudapan Tradisional Nusantara"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-2.5 py-1 rounded bg-brand-600/90 text-xs font-medium uppercase tracking-wider">
                    Best Seller Bulan Ini
                  </span>
                  <h3 className="text-xl font-bold font-serif mt-2">Kopi Arabika Gayo Single Origin</h3>
                  <p className="text-sm text-gray-200 mt-0.5">Freshly roasted with love & care</p>
                </div>
              </div>

              {/* Floating Card: Testimonial Snippet */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-100 hidden sm:flex items-center gap-3 max-w-xs animate-bounce-short">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
                  ★ 5.0
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-900">1,200+ Pesanan Terkirim</p>
                  <p className="text-gray-500">Tingkat kepuasan 99.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
