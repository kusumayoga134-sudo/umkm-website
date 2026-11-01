'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { ContactMessage } from '@/types';
import { Mail, Phone, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Kotak Pesan Masuk & Kemitraan
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pesan pertanyaan dan penawaran kerjasama dari calon pembeli atau mitra kafe/reseller.
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">
              Memuat pesan masuk...
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">
              Belum ada pesan kontak yang masuk.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{msg.subject}</h3>
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
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                  {msg.message}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <a
                    href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Mail className="w-3.5 h-3.5" /> Balas via Email
                  </a>
                  {msg.phone && (
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo Kak ${msg.name}, terima kasih telah menghubungi Karsa Rasa Nusantara mengenai "${msg.subject}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Balas di WhatsApp
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
