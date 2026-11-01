'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { ContactMessage } from '@/types';
import { Mail, Phone, Calendar, MessageSquare, Sparkles, Search, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner - Warm Artisanal Glow */}
        <div className="mb-6 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs ambient-glow">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-brand-200/70">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Kemitraan Kafe & Reseller UMKM</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif leading-tight">
            Kotak Pesan Masuk & Reseller
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Kelola pertanyaan konsumen, penawaran suplai biji kopi ke kafe/restoran, dan permohonan kemitraan dari pengunjung website.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-brand-200/80 shadow-xs mb-6 flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-600 ml-1 shrink-0" />
          <input
            type="text"
            placeholder="Cari pengirim, subjek pesan, email, atau isi penawaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl sm:rounded-3xl border border-brand-200/80">
              Memuat pesan masuk...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl sm:rounded-3xl border border-brand-200/80">
              {search ? 'Tidak ada pesan yang sesuai dengan pencarian.' : 'Belum ada pesan kontak yang masuk.'}
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const initials = msg.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={msg.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs hover:shadow-md transition duration-200 space-y-4"
                >
                  {/* Top: Sender Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-100/80 pb-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-md shadow-brand-700/20 shrink-0">
                        {initials || <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 font-serif leading-snug">
                          {msg.subject}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>Dari:</span>
                          <strong className="text-gray-900">{msg.name}</strong>
                          <span className="text-gray-400">•</span>
                          <a href={`mailto:${msg.email}`} className="text-brand-700 hover:underline">
                            {msg.email}
                          </a>
                          {msg.phone && (
                            <>
                              <span className="text-gray-400">•</span>
                              <a
                                href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 font-medium hover:underline flex items-center gap-0.5"
                              >
                                <span>WA: {msg.phone}</span>
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-400 flex items-center gap-1 bg-brand-50/60 px-2.5 py-1 rounded-lg border border-brand-100 self-start sm:self-auto shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Body: Message Content Box */}
                  <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gradient-to-br from-brand-50/60 to-brand-100/30 p-4 sm:p-5 rounded-2xl border border-brand-200/60 whitespace-pre-wrap shadow-2xs font-normal">
                    {msg.message}
                  </div>

                  {/* Bottom: Fast Reply Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Balasan Karsa Rasa: ${encodeURIComponent(msg.subject)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-brand-50 text-gray-800 border border-brand-300 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5 text-brand-700" />
                      <span>Balas via Email</span>
                    </a>
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Kak ${msg.name}, kami dari tim Karsa Rasa Nusantara ingin menindaklanjuti pesan Anda mengenai "${msg.subject}". Ada yang bisa kami bantu?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Balas di WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
