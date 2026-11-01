'use client';

import React from 'react';
import { Award, Sprout, HeartHandshake } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="cerita" className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Imagery Grid */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
                  alt="Petani Biji Kopi Lokal"
                  className="rounded-2xl sm:rounded-3xl shadow-sm object-cover h-44 sm:h-60 w-full"
                  loading="lazy"
                />
                <div className="p-3.5 sm:p-5 rounded-2xl bg-brand-100 text-brand-900 space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-serif">100%</div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-700">
                    Bahan Asli Nusantara
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-brand-800 leading-relaxed">
                    Dipetik dari kebun petani lokal binaan tanpa perantara tengkulak.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
                <div className="p-3.5 sm:p-5 rounded-2xl bg-emerald-50 text-emerald-950 space-y-1 border border-emerald-100">
                  <div className="text-xl sm:text-2xl font-bold font-serif">40+</div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Keluarga Petani
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-emerald-800 leading-relaxed">
                    Mendukung perputaran ekonomi mikro desa di berbagai pelosok daerah.
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                  alt="Proses Pembuatan Produk Higienis"
                  className="rounded-2xl sm:rounded-3xl shadow-sm object-cover h-44 sm:h-60 w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-100 text-brand-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-brand-600" />
              <span>Kisah & Dedikasi Kami</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-serif leading-snug">
              Dari Hati Para Pengrajin Rasa, Untuk Meja Keluarga Indonesia.
            </h2>

            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
              <strong>Karsa Rasa Nusantara</strong> lahir dari kecintaan kami terhadap kekayaan rempah alami, kopi pegunungan single origin, dan camilan renyah nusantara. Kami merangkul potensi hasil panen petani dan racikan resep warisan leluhur dengan kemasan higienis berstandar modern.
            </p>

            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
              Setiap produk yang Anda nikmati adalah bukti dedikasi para petani kopi di Aceh & Temanggung, ibu-ibu produsen keripik pisang Lampung, serta pengrajin sambal cakalang Manado. Bebas pewarna dan pemanis buatan, higienis, serta 100% halal.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 rounded-xl bg-brand-100 text-brand-700 shrink-0">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">Alami Tanpa Pengawet</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Olahan rempah murni dan proses sangrai berkala untuk menjaga kesegaran rasa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 rounded-xl bg-brand-100 text-brand-700 shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">Standar Mutu Terjaga</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Setiap batch produksi melewati pengujian rasa dan higienitas sebelum dikirim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
