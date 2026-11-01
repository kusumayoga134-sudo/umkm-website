'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, Package, ShoppingCart, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag-to-scroll state for desktop mouse users in emulation
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produk & Stok', icon: Package },
    { href: '/admin/orders', label: 'Pesanan Masuk', icon: ShoppingCart },
    { href: '/admin/messages', label: 'Kotak Pesan', icon: MessageSquare },
  ];

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -150 : 150;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 250);
  };

  // Mouse drag handlers (enables horizontal dragging with mouse on PC/preview!)
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
    const walk = (x - startX);
    if (Math.abs(walk) > 4) {
      setIsDragging(true);
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollStart - walk;
      checkScroll();
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
        <div className="flex items-center justify-between h-14 sm:h-16 border-b border-brand-200/40 md:border-b-0">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-brand-100" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-bold font-serif text-gray-900 tracking-tight">
                Karsa Rasa
              </span>
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-md border border-brand-200">
                Panel Admin
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-gray-700 hover:text-brand-700 hover:bg-brand-100/60'
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-gray-700 bg-white hover:bg-brand-50 hover:text-brand-700 border border-brand-200 shadow-2xs transition active:scale-95 shrink-0"
            title="Buka Website Pengunjung"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-600" />
            <span>Lihat Toko</span>
          </Link>
        </div>

        {/* Mobile Horizontal Sub-Navigation Tab Bar with Swipe & Drag support! */}
        <div className="md:hidden relative py-2 -mx-4 px-4 overflow-hidden">
          {/* Scroll Left Helper Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/95 border border-brand-200 shadow-md flex items-center justify-center text-brand-700 transition"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Scroll Right Helper Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/95 border border-brand-200 shadow-md flex items-center justify-center text-brand-700 transition"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing px-1"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (isDragging) e.preventDefault();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-gray-700 bg-white/80 border border-brand-200/70 hover:bg-white hover:text-brand-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
