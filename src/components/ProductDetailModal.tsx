'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { X, Star, ShoppingCart, Plus, Minus, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-brand-200/80 transition-all max-h-[90vh] flex flex-col"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md transition"
          aria-label="Tutup Detail"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto bg-brand-50 min-h-[200px] md:min-h-full">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-full bg-brand-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                  Unggulan
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold mb-1 sm:mb-2">
                  <span className="text-brand-600 uppercase font-bold">{product.category?.name || 'UMKM'}</span>
                  <span>Berat: {product.weight}</span>
                </div>

                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-serif leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {product.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-gray-400">• Stok: {product.stock} pcs</span>
                </div>

                {/* Price */}
                <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-700">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-3 sm:mt-4 border-t border-gray-100 pt-2.5">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Deskripsi Produk
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-h-32 sm:max-h-40 overflow-y-auto pr-1">
                    {product.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 sm:py-2 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>100% Asli, Higienis & Jaminan Mutu</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
                {/* Quantity selector */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Jumlah:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-1.5 sm:p-2 hover:bg-gray-200 text-gray-600 transition disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="p-1.5 sm:p-2 hover:bg-gray-200 text-gray-600 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md active:scale-98'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Stok Telah Habis' : 'Masukkan ke Keranjang'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
