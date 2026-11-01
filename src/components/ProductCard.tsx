'use client';

import React from 'react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetail }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-brand-200/70 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden bg-brand-50 cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Pilihan
            </span>
          )}
          {discountPercentage && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
          className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-1.5 text-white font-semibold text-xs backdrop-blur-2xs"
          aria-label={`Lihat detail ${product.name}`}
        >
          <span className="bg-white/95 text-gray-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-white transition text-xs">
            <Eye className="w-3.5 h-3.5 text-brand-600" /> Lihat Detail
          </span>
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-red-500 text-white px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-700 uppercase font-semibold mb-1">
            <span className="truncate max-w-[70%]">{product.category?.name || 'UMKM'}</span>
            <span className="text-gray-600 shrink-0">{product.weight}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-bold text-gray-900 text-xs sm:text-sm md:text-base leading-snug line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="text-xs sm:text-base md:text-lg font-extrabold text-brand-700 truncate">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[10px] sm:text-xs text-gray-400 line-through truncate">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl font-medium transition flex items-center justify-center shrink-0 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs hover:shadow active:scale-95'
            }`}
            title="Tambah ke Keranjang"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
