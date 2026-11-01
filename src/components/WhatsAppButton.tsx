'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_UMKM_WHATSAPP || '6281234567890';
  const message = 'Halo Admin Karsa Rasa Nusantara, saya tertarik dengan produk UMKM Anda dan ingin bertanya.';

  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Admin UMKM via WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-emerald-300"></span>
        </span>

        {/* Hover Tooltip (desktop) */}
        <span className="hidden md:inline-block absolute right-16 bg-gray-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tanya Kami di WhatsApp
        </span>
      </a>
    </aside>
  );
}
