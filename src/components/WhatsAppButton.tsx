'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890';
  const message = 'Halo Admin Karsa Rasa Nusantara, saya tertarik dengan produk UMKM Anda dan ingin bertanya.';

  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Admin UMKM via WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>

        {/* Hover Pill Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tanya Kami di WhatsApp
        </span>
      </a>
    </aside>
  );
}
