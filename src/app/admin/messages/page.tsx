'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { ContactMessage } from '@/types';
import { Mail, Phone, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (e) {
      toast.error('Gagal memuat pesan', { id: 'admin-msg-load' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner */}
        <div className="mb-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Kemitraan & Pertanyaan</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
            Kotak Pesan Masuk & Reseller
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pesan pertanyaan dan penawaran kemitraan suplai kafe/restoran dari pengunjung website.
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-brand-200/80">
              Memuat pesan masuk...
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-brand-200/80">
              Belum ada pesan kontak yang masuk.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">{msg.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pengirim: <strong className="text-gray-800">{msg.name}</strong> •{' '}
                      <a href={`mailto:${msg.email}`} className="text-brand-600 underline">
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <span>
                          {' '}
                          • Telp/WA:{' '}
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 underline font-medium"
                          >
                            {msg.phone}
                          </a>
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-brand-50/40 p-3.5 sm:p-4 rounded-xl border border-brand-100 whitespace-pre-wrap">
                  {msg.message}
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-1">
                  <a
                    href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Balas via Email</span>
                  </a>
                  {msg.phone && (
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo Kak ${msg.name}, kami dari UMKM Karsa Rasa Nusantara ingin merespon pesan Anda terkait "${msg.subject}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Balas di WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
