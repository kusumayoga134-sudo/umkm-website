'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { filterProducts } from '@/lib/utils';
import { Search, SlidersHorizontal, PackageOpen, X, Check, ChevronDown, RotateCcw } from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: Product[];
  categories: Category[];
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Paling Populer' },
  { value: 'price-low', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-high', label: 'Harga: Tinggi ke Rendah' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'name', label: 'Nama Produk (A-Z)' },
];

export default function ProductCatalog({ initialProducts, categories }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Dropdown ref for click outside
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Category horizontal scroll ref with drag-to-scroll
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isCatMouseDown, setIsCatMouseDown] = useState(false);
  const [catStartX, setCatStartX] = useState(0);
  const [catScrollStart, setCatScrollStart] = useState(0);
  const [isCatDragging, setIsCatDragging] = useState(false);

  // Close sort dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts(initialProducts, searchQuery, selectedCategory, sortBy);
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Paling Populer';

  const isFilterActive = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== 'featured';

  // Category horizontal drag handlers
  const handleCatMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsCatMouseDown(true);
    setIsCatDragging(false);
    setCatStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setCatScrollStart(categoryScrollRef.current.scrollLeft);
  };

  const handleCatMouseMove = (e: React.MouseEvent) => {
    if (!isCatMouseDown || !categoryScrollRef.current) return;
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = x - catStartX;
    if (Math.abs(walk) > 4) {
      setIsCatDragging(true);
      e.preventDefault();
      categoryScrollRef.current.scrollLeft = catScrollStart - walk;
    }
  };

  const handleCatMouseUpOrLeave = () => {
    setIsCatMouseDown(false);
    setTimeout(() => setIsCatDragging(false), 50);
  };

  return (
    <section id="katalog" className="py-12 sm:py-16 md:py-24 bg-brand-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/90 px-3 py-1 rounded-full border border-brand-200/80">
            Produk Pilihan UMKM
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 font-serif mt-2.5 sm:mt-3">
            Katalog Produk Berkualitas
          </h2>
          <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            Temukan sajian kopi artisan, kudapan gurih & manis alami, dan sambal rempah warisan leluhur.
          </p>
        </div>

        {/* Filter & Search Bar - Elegant, Senada & Coherent */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs border border-brand-200/80 mb-6 sm:mb-8 space-y-3">
          {/* Top Row: Search Input + Custom Sort Popover */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kopi, camilan, sambal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-brand-50/40 border border-brand-200/80 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition text-gray-800 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Custom Elegant Sort Popover */}
            <div className="relative shrink-0" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition border shadow-2xs ${
                  isSortOpen || sortBy !== 'featured'
                    ? 'bg-brand-50 text-brand-800 border-brand-300'
                    : 'bg-white text-gray-700 border-brand-200/90 hover:border-brand-300 hover:bg-brand-50/50'
                }`}
                aria-expanded={isSortOpen}
                aria-label="Pilih urutan produk"
              >
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="text-gray-400 font-normal hidden xs:inline">Urutkan:</span>
                  <span className="text-gray-900 truncate max-w-[140px] sm:max-w-none">{activeSortLabel}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-brand-700 transition-transform duration-200 ${
                    isSortOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Floating Menu Popover */}
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-white/98 backdrop-blur-md border border-brand-200/90 shadow-xl rounded-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-brand-100 mb-1">
                    Urutkan Berdasarkan
                  </div>
                  <div className="space-y-0.5">
                    {SORT_OPTIONS.map((option) => {
                      const isSelected = sortBy === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                            isSelected
                              ? 'bg-brand-100/90 text-brand-900 font-bold'
                              : 'text-gray-700 hover:bg-brand-50 hover:text-brand-800'
                          }`}
                        >
                          <span>{option.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Tabs (Horizontal Scrollable with Drag & Swipe) */}
          <div
            ref={categoryScrollRef}
            onMouseDown={handleCatMouseDown}
            onMouseMove={handleCatMouseMove}
            onMouseUp={handleCatMouseUpOrLeave}
            onMouseLeave={handleCatMouseUpOrLeave}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing select-none"
          >
            <button
              onClick={() => {
                if (!isCatDragging) setSelectedCategory('all');
              }}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-xs'
                  : 'bg-brand-50/60 text-gray-700 border border-brand-200/70 hover:bg-brand-100 hover:text-brand-800'
              }`}
            >
              <span>✨ Semua</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-800'
                }`}
              >
                {initialProducts.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = cat._count?.products ?? 0;
              const getCategoryIcon = (slug: string) => {
                if (slug.includes('kopi')) return '☕';
                if (slug.includes('camilan')) return '🍌';
                if (slug.includes('sambal')) return '🌶️';
                if (slug.includes('hampers')) return '🎁';
                return '🏷️';
              };

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (!isCatDragging) setSelectedCategory(cat.slug);
                  }}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-xs'
                      : 'bg-brand-50/60 text-gray-700 border border-brand-200/70 hover:bg-brand-100 hover:text-brand-800'
                  }`}
                >
                  <span>{getCategoryIcon(cat.slug)}</span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Helper Bar */}
          {isFilterActive && (
            <div className="pt-2 border-t border-brand-100/80 flex items-center justify-between text-[11px] text-gray-500">
              <span>
                Menampilkan <strong className="text-gray-900">{filteredProducts.length}</strong> produk
                {searchQuery ? ` untuk "${searchQuery}"` : ''}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSortBy('featured');
                }}
                className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-bold hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Grid: 2 columns on mobile, 4 columns on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-brand-200 max-w-md mx-auto">
            <PackageOpen className="w-10 h-10 sm:w-12 sm:h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('featured');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-brand-100 text-brand-700 hover:bg-brand-200 transition"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
}
