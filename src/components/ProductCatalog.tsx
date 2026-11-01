'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { filterProducts } from '@/lib/utils';
import { Search, SlidersHorizontal, PackageOpen, X } from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductCatalog({ initialProducts, categories }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return filterProducts(initialProducts, searchQuery, selectedCategory, sortBy);
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <section id="katalog" className="py-12 sm:py-16 md:py-24 bg-brand-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
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

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs border border-brand-200/80 mb-6 sm:mb-8 space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kopi, camilan, sambal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="text-[11px] sm:text-xs text-gray-500 font-medium whitespace-nowrap">
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="name">Nama Produk (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Horizontal Scrollable on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Produk ({initialProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} {cat._count ? `(${cat._count.products})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 2 columns on mobile, 4 columns on desktop! */}
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
