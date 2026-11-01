'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { filterProducts } from '@/lib/utils';
import { Search, SlidersHorizontal, PackageOpen } from 'lucide-react';

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
    <section id="katalog" className="py-16 md:py-24 bg-brand-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
            Produk Pilihan UMKM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif mt-3">
            Katalog Produk Berkualitas
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Temukan sajian kopi istimewa, camilan renyah, dan bumbu rempah pilihan yang diproses secara higienis dan penuh cinta.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kopi, sambal, keripik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="name">Nama Produk (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Produk ({initialProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} {cat._count ? `(${cat._count.products})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-200 max-w-md mx-auto">
            <PackageOpen className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Tidak ada produk ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">
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
