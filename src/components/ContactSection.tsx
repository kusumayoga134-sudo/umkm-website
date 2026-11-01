'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Mohon lengkapi semua bidang yang bertanda bintang!');
      return;
    }

    try {
      setIsSending(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Pesan Anda berhasil dikirim! Kami akan segera merespon.');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        toast.error(data.error || 'Gagal mengirim pesan.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="kontak" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
                Hubungi Kami
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif mt-3">
                Mari Berkolaborasi & Terhubung
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
                Ingin konsultasi pesanan hampers korporat, pemesanan skala besar untuk kafe/resto, atau sekadar bertanya seputar produk kami? Tim kami siap melayani dengan senang hati.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Rumah Roastery & Dapur Olahan</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Jl. Karsa Rasa No. 18, Kotagede, D.I. Yogyakarta 55173
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Jam Operasional Layanan</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Senin - Sabtu: 08.00 - 18.00 WIB (Minggu & Libur Nasional Tutup)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">WhatsApp Pelanggan</h4>
                  <p className="text-xs text-gray-600 mt-0.5">+62 812-3456-7890 (Respon Cepat)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Email Resmi</h4>
                  <p className="text-xs text-gray-600 mt-0.5">halo@karsarasa.id</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-brand-50/40 p-6 sm:p-8 rounded-3xl border border-brand-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-serif mb-1">
              Kirim Pesan atau Pertanyaan
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Isi formulir di bawah ini dan admin UMKM kami akan menghubungi Anda kembali dalam kurun waktu 1x24 jam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subjek Keperluan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kemitraan, Pesanan Khusus, dll"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pesan Lengkap *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan pertanyaan, detail kebutuhan, atau penawaran Anda..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Mengirim...' : 'Kirim Pesan Sekarang'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
