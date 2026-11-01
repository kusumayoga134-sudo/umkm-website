'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/types';
import { Star, MessageCirclePlus, Quote } from 'lucide-react';
import toast from 'react-hot-toast';

interface TestimonialsSectionProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      toast.error('Nama dan ulasan wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          roleOrCity: city || 'Pelanggan Setia',
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestimonials([data.data, ...testimonials]);
        toast.success('Terima kasih! Ulasan Anda berhasil ditampilkan.');
        setShowAddModal(false);
        setName('');
        setCity('');
        setComment('');
      } else {
        toast.error(data.error || 'Gagal mengirim ulasan');
      }
    } catch (e) {
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimoni" className="py-12 sm:py-16 md:py-24 bg-brand-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/90 px-3 py-1 rounded-full border border-brand-200/80">
              Cerita Dari Pelanggan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-serif mt-2.5 sm:mt-3">
              Kata Mereka Tentang Karsa Rasa
            </h2>
            <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base max-w-xl">
              Ulasan asli dari para penikmat kopi, ibu rumah tangga, dan mitra kafe di seluruh pelosok Indonesia.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white border border-brand-300 text-gray-800 hover:text-brand-600 hover:border-brand-400 font-bold text-xs shadow-xs transition shrink-0"
          >
            <MessageCirclePlus className="w-4 h-4 text-brand-600" />
            <span>Tulis Pengalaman Anda</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-100 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-brand-200" />
                </div>

                <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-3.5 border-t border-gray-100">
                <img
                  src={
                    item.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.customerName
                    )}&background=f2dbc5&color=7a3c26&bold=true`
                  }
                  alt={item.customerName}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-brand-200"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{item.customerName}</h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">{item.roleOrCity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Testimonial */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-brand-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif">
              Bagikan Pengalaman Anda
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Pendapat Anda sangat berarti bagi pengembangan produk UMKM kami.
            </p>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Amalia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kota / Profesi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pecinta Kopi - Yogyakarta"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ulasan Anda *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan rasa, kualitas, atau pelayanan pengiriman..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
