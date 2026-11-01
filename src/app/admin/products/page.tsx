'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Product, Category } from '@/types';
import { Plus, Trash2, Edit2, Search, X, Package, Sparkles, Check, AlertTriangle, Layers, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all');

  // Modal create product
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [weight, setWeight] = useState('250 gram');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modern In-App Stock Adjustment Modal (replaces browser prompt)
  const [stockModalProduct, setStockModalProduct] = useState<{ id: string; name: string; currentStock: number } | null>(null);
  const [adjustedStockValue, setAdjustedStockValue] = useState(0);

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();
      if (dataProd.success) setProducts(dataProd.data);
      if (dataCat.success) {
        setCategories(dataCat.data);
        if (dataCat.data.length > 0) setCategoryId(dataCat.data[0].id);
      }
    } catch (e) {
      toast.error('Gagal memuat produk', { id: 'admin-load-prod' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast.error('Lengkapi nama produk, harga, dan kategori', { id: 'admin-prod-val' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          stock: parseInt(stock),
          categoryId,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
          weight,
          isFeatured,
          isAvailable: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Produk baru berhasil ditambahkan!', { id: 'admin-prod-success' });
        setShowAddModal(false);
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        setImageUrl('');
        fetchData();
      } else {
        toast.error(data.error || 'Gagal menambahkan produk', { id: 'admin-prod-err' });
      }
    } catch (e) {
      toast.error('Terjadi kesalahan jaringan', { id: 'admin-prod-net' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          originalPrice: editingProduct.originalPrice,
          stock: editingProduct.stock,
          categoryId: editingProduct.categoryId,
          imageUrl: editingProduct.imageUrl,
          weight: editingProduct.weight,
          isFeatured: editingProduct.isFeatured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Perubahan produk berhasil disimpan!', { id: 'admin-edit-success' });
        setEditingProduct(null);
        fetchData();
      } else {
        toast.error(data.error || 'Gagal menyimpan perubahan', { id: 'admin-edit-err' });
      }
    } catch (e) {
      toast.error('Terjadi kesalahan jaringan', { id: 'admin-edit-net' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Hapus produk "${prodName}" dari katalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Produk berhasil dihapus', { id: 'admin-del-success' });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(data.error || 'Gagal menghapus', { id: 'admin-del-err' });
      }
    } catch (e) {
      toast.error('Gagal menghapus produk', { id: 'admin-del-net' });
    }
  };

  const openStockModal = (prod: Product) => {
    setStockModalProduct({ id: prod.id, name: prod.name, currentStock: prod.stock });
    setAdjustedStockValue(prod.stock);
  };

  const handleSaveStockModal = async () => {
    if (!stockModalProduct) return;
    const newStock = Math.max(0, adjustedStockValue);

    try {
      const res = await fetch(`/api/products/${stockModalProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Stok ${stockModalProduct.name} diubah menjadi ${newStock} pcs`, { id: 'admin-stock-success' });
        setProducts((prev) =>
          prev.map((p) => (p.id === stockModalProduct.id ? { ...p, stock: newStock } : p))
        );
        setStockModalProduct(null);
      }
    } catch (e) {
      toast.error('Gagal update stok', { id: 'admin-stock-err' });
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedAdminCategory === 'all' || p.category?.slug === selectedAdminCategory;
    const matchesStock =
      selectedStockFilter === 'all' ||
      (selectedStockFilter === 'low' && p.stock > 0 && p.stock <= 15) ||
      (selectedStockFilter === 'out' && p.stock <= 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs ambient-glow">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-brand-600" />
              <span>Inventaris & Stok UMKM</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Manajemen Produk & Stok
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola katalog produk, sesuaikan stok secara langsung, atau ubah rincian harga jual.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-700/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama produk atau kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-brand-50/40 border border-brand-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-1 text-gray-400 hover:text-gray-600 absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Stock Status Filter */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedStockFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedStockFilter === 'all'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-brand-50/60 text-gray-700 border border-brand-200/70 hover:bg-brand-100'
                }`}
              >
                Semua Stok
              </button>
              <button
                onClick={() => setSelectedStockFilter('low')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                  selectedStockFilter === 'low'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Menipis (&le;15)</span>
              </button>
              <button
                onClick={() => setSelectedStockFilter('out')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedStockFilter === 'out'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                Habis (0)
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar touch-pan-x">
            <button
              onClick={() => setSelectedAdminCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition shrink-0 ${
                selectedAdminCategory === 'all'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua Kategori ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedAdminCategory(cat.slug)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    selectedAdminCategory === cat.slug
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-50/60 text-gray-600 uppercase tracking-wider font-semibold border-b border-brand-100">
                <tr>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Stok Gudang</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      Memuat produk...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      Tidak ada produk ditemukan sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-brand-50/30 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{prod.name}</span>
                              {prod.isFeatured && (
                                <span className="text-[9px] bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Unggulan
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400">{prod.weight}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {prod.category?.name || '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-brand-700">{formatRupiah(prod.price)}</div>
                        {prod.originalPrice && (
                          <div className="text-[10px] text-gray-400 line-through">
                            {formatRupiah(prod.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openStockModal(prod)}
                          className="px-2.5 py-1 rounded-lg border border-brand-200 bg-brand-50/60 hover:bg-brand-100 font-mono font-bold text-gray-800 transition text-[11px] flex items-center gap-1.5 shadow-2xs hover:border-brand-300"
                          title="Klik untuk ubah stok kuota"
                        >
                          <span>{prod.stock} pcs</span>
                          <Edit2 className="w-3 h-3 text-brand-600" />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        {prod.stock <= 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Habis
                          </span>
                        ) : prod.stock <= 15 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Menipis
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Tersedia
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                          title="Edit Rincian Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Memuat produk...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">Tidak ada produk ditemukan.</div>
            ) : (
              filtered.map((prod) => (
                <div key={prod.id} className="p-3.5 flex items-start gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-gray-900 leading-snug line-clamp-1">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="text-gray-400 hover:text-brand-600 p-1"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {prod.category?.name} • {prod.weight}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100">
                      <span className="text-xs font-bold text-brand-700">
                        {formatRupiah(prod.price)}
                      </span>

                      <button
                        onClick={() => openStockModal(prod)}
                        className="px-2 py-0.5 rounded-lg border border-brand-200 bg-brand-50 text-[10px] font-bold text-gray-800 flex items-center gap-1"
                      >
                        <span>Stok: {prod.stock}</span>
                        <Edit2 className="w-2.5 h-2.5 text-brand-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Stock Adjustment In-App Modal (Sleek, Instant & No Prompt) */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-brand-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                  Update Stok Cepat
                </span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 truncate max-w-[230px]">
                  {stockModalProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setStockModalProduct(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="text-center">
                <span className="text-xs text-gray-500">Jumlah Stok Sekarang:</span>
                <div className="text-3xl font-extrabold text-brand-700 font-mono mt-1">
                  {adjustedStockValue} <span className="text-xs text-gray-500 font-sans font-normal">pcs</span>
                </div>
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustedStockValue((v) => Math.max(0, v - 5))}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustedStockValue((v) => Math.max(0, v - 1))}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={adjustedStockValue}
                  onChange={(e) => setAdjustedStockValue(parseInt(e.target.value) || 0)}
                  className="w-20 text-center py-1.5 px-2 border border-brand-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setAdjustedStockValue((v) => v + 1)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustedStockValue((v) => v + 5)}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustedStockValue((v) => v + 10)}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                >
                  +10
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStockModal}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-xs"
              >
                Simpan Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-brand-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif">
                Edit Data Produk
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-3.5 mt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Coret (Opsional)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Berat / Ukuran
                  </label>
                  <input
                    type="text"
                    value={editingProduct.weight}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, weight: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editingProduct.isFeatured}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <label htmlFor="editFeatured" className="text-xs text-gray-700 font-semibold cursor-pointer">
                  Tandai sebagai Produk Pilihan / Unggulan di Beranda
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-brand-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-brand-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif">
                Tambah Produk UMKM Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 mt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Robusta Temanggung 250g"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="55000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Coret (Opsional)
                  </label>
                  <input
                    type="number"
                    placeholder="65000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Berat / Ukuran
                  </label>
                  <input
                    type="text"
                    placeholder="250 gram / 500 ml"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL Foto Produk
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  placeholder="Karakteristik rasa, bahan baku, asal panen..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <label htmlFor="featured" className="text-xs text-gray-700 font-semibold cursor-pointer">
                  Tampilkan sebagai Produk Pilihan di Beranda
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-brand-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Tambahkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
