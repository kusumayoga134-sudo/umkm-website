'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { X, Star, ShoppingCart, Plus, Minus, Check, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-brand-200 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md transition"
          aria-label="Tutup Detail"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-brand-50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                Produk Unggulan
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
                <span className="text-brand-600 uppercase">{product.category?.name || 'UMKM'}</span>
                <span>Berat: {product.weight}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-gray-400">• Stok: {product.stock} pcs</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-brand-700">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4 border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Asli, Higienis & Jaminan Garansi Mutu</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 mt-6 space-y-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition duration-200 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 active:scale-98'
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
  );
}
