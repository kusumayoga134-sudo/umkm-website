'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Truck, MessageCircle } from 'lucide-react';

export default function Hero() {
  const whatsappNumber = process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Halo Karsa Rasa Nusantara, saya ingin bertanya seputar produk UMKM Anda.'
  )}`;

  return (
    <section id="beranda" className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-brand-200/50 via-brand-100/30 to-transparent -z-10 rounded-b-[60px] sm:rounded-b-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-100/90 text-brand-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs border border-brand-200/80">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Bangga Buatan Indonesia • Mutu Terjamin</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-snug sm:leading-[1.18] font-serif">
              Otentikasi Rasa{' '}
              <span className="text-brand-700 underline decoration-brand-300 decoration-wavy decoration-2 sm:decoration-4 underline-offset-4">
                Nusantara
              </span>{' '}
              Langsung ke Rumah Anda.
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Kami menghadirkan biji kopi sangrai pilihan petani lokal, kudapan sehat tanpa bahan pengawet, dan sambal rempah warisan tradisi. Dukung ekonomi UMKM dengan cita rasa istimewa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/25 transition duration-200 group"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-brand-50/80 active:scale-98 text-gray-800 font-bold text-xs sm:text-sm border border-brand-300/80 shadow-xs transition duration-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Konsultasi via WA</span>
              </a>
            </div>

            {/* Value Proposition Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-brand-200/70 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100 sm:bg-transparent sm:border-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">100% Petani</h4>
                  <p className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">Lokal Nusantara</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100 sm:bg-transparent sm:border-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">Alami & Halal</h4>
                  <p className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">Bebas Pengawet</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100 sm:bg-transparent sm:border-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 leading-tight">Kirim Cepat</h4>
                  <p className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">Packing Aman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Frame */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Main Image Card */}
              <div className="relative overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-brand-100 aspect-[4/3] sm:aspect-[4/4] lg:aspect-[4/5] max-h-[380px] sm:max-h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                  alt="Kopi & Kudapan Tradisional Nusantara"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-600/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Best Seller Bulan Ini
                  </span>
                  <h3 className="text-base sm:text-xl font-bold font-serif mt-1.5">
                    Kopi Arabika Gayo Single Origin
                  </h3>
                  <p className="text-xs text-gray-200 mt-0.5">Freshly roasted with care</p>
                </div>
              </div>

              {/* Floating Customer Stat Pill */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg border border-brand-100 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                  ★ 5.0
                </div>
                <div className="text-left">
                  <p className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">
                    1,200+ Pesanan Terkirim
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">Tingkat kepuasan 99.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
