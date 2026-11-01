'use client';

import React from 'react';
import { Award, Users, Sprout, HeartHandshake } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="cerita" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Imagery Grid */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
                  alt="Petani Biji Kopi Lokal"
                  className="rounded-3xl shadow-md object-cover h-64 w-full"
                />
                <div className="p-5 rounded-2xl bg-brand-100 text-brand-900 space-y-1">
                  <div className="text-2xl font-bold font-serif">100%</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                    Bahan Baku Nusantara
                  </div>
                  <p className="text-[11px] text-brand-800 leading-relaxed">
                    Langsung dari perkebunan dan kelompok tani lokal tanpa tengkulak.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-5 rounded-2xl bg-forest-50 text-forest-900 space-y-1 border border-forest-100">
                  <div className="text-2xl font-bold font-serif">40+</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-forest-700">
                    Keluarga Petani Terbantu
                  </div>
                  <p className="text-[11px] text-forest-800 leading-relaxed">
                    Mendukung kesejahteraan mitra produsen lokal di berbagai daerah.
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                  alt="Proses Pembuatan Produk Higienis"
                  className="rounded-3xl shadow-md object-cover h-64 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-brand-600" />
              <span>Kisah & Dedikasi Kami</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif leading-tight">
              Dari Hati Para Pengrajin Rasa, Untuk Meja Keluarga Indonesia.
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              <strong>Karsa Rasa Nusantara</strong> bermula dari kecintaan kami terhadap kekayaan rempah, kopi dataran tinggi, dan camilan tradisional Indonesia. Kami melihat banyak potensi hasil panen petani dan racikan resep warisan leluhur yang belum terwadahi dengan pengemasan modern dan standar mutu tinggi.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Setiap kemasan yang sampai di tangan Anda adalah hasil kolaborasi erat dengan para petani kopi Gayo & Temanggung, ibu-ibu pengrajin keripik pisang Lampung, dan pembuat sambal tradisional Manado. Kami berkomitmen menyajikan produk berkualitas tanpa bahan kimia berbahaya, higienis, dan teruji halal.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 rounded-xl bg-brand-100 text-brand-700">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Alami Tanpa Pengawet</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Menggunakan teknik pengolahan alami dan rempah murni untuk keawetan higienis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 rounded-xl bg-brand-100 text-brand-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Standar Mutu Terjaga</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Lolos uji rasa dan kelayakan konsumsi secara berkala sebelum didistribusikan.
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
