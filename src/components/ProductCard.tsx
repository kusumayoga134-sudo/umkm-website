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
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Pilihan
            </span>
          )}
          {discountPercentage && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Hemat {discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick View Button on hover */}
        <button
          onClick={() => onOpenDetail(product)}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-xs"
          aria-label={`Lihat detail ${product.name}`}
        >
          <span className="bg-white/90 text-gray-900 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-white transition">
            <Eye className="w-4 h-4 text-brand-600" /> Lihat Detail
          </span>
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight */}
          <div className="flex items-center justify-between text-[11px] text-gray-700 uppercase font-semibold mb-1.5">
            <span>{product.category?.name || 'UMKM'}</span>
            <span className="text-gray-600">{product.weight}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-brand-700">
              {formatRupiah(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 line-through">
                {formatRupiah(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl font-medium transition flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
