'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, Package, ShoppingCart, MessageSquare, ArrowLeft } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll state for desktop mouse users in emulation
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard, badge: '📊' },
    { href: '/admin/products', label: 'Produk & Stok', icon: Package, badge: '📦' },
    { href: '/admin/orders', label: 'Pesanan Masuk', icon: ShoppingCart, badge: '🛒' },
    { href: '/admin/messages', label: 'Kotak Pesan', icon: MessageSquare, badge: '💬' },
  ];

  // Auto-center the active tab smoothly on mobile when pathname changes
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [pathname]);

  // Mouse drag handlers (enables horizontal dragging with mouse on PC/preview)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 4) {
      setIsDragging(true);
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollStart - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-brand-200/80 shadow-xs transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title */}
          <Link href="/admin" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-brand-100" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-bold font-serif text-gray-900 tracking-tight">
                Karsa Rasa
              </span>
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-brand-100/90 text-brand-800 px-2 py-0.5 rounded-md border border-brand-200/80 shadow-2xs">
                Panel Admin
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Segmented Pill Style) */}
          <nav className="hidden md:flex items-center gap-1 bg-brand-100/60 p-1 rounded-2xl border border-brand-200/70 shadow-2xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-brand-800 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Exit / View Store Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-gray-800 bg-white hover:bg-brand-50 hover:text-brand-700 border border-brand-200/90 shadow-2xs hover:shadow-xs transition active:scale-95 shrink-0"
            title="Buka Website Pengunjung"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-600" />
            <span>Lihat Toko</span>
          </Link>
        </div>

        {/* Mobile Horizontal Sub-Navigation Tab Bar - Smooth, Fluid & Senada (No Clunky Arrows) */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing bg-brand-100/60 p-1 rounded-2xl border border-brand-200/70 shadow-2xs"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={(e) => {
                    if (isDragging) e.preventDefault();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-sm scale-102'
                      : 'text-gray-700 hover:text-brand-800 hover:bg-white/70'
                  }`}
                >
                  <span className="text-xs">{link.badge}</span>
                  <span className="text-xs">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
