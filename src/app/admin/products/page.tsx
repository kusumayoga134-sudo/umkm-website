'use client';

import React, { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { formatRupiah } from '@/lib/utils';
import { Product, Category } from '@/types';
import { Plus, Trash2, Edit2, Search, X, Package, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const handleUpdateStock = async (id: string, currentStock: number) => {
    const input = prompt('Masukkan kuota stok baru:', currentStock.toString());
    if (input === null) return;
    const newStock = parseInt(input);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Stok tidak valid', { id: 'admin-stock-val' });
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Stok berhasil diperbarui', { id: 'admin-stock-success' });
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (e) {
      toast.error('Gagal update stok', { id: 'admin-stock-err' });
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-brand-600" />
              <span>Inventaris & Stok</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Manajemen Produk & Stok
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola katalog produk UMKM, atur harga jual, kuota stok, atau tambahkan item baru.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-brand-200/80 shadow-xs mb-6 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 text-gray-400 hover:text-gray-600 mr-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
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
                  <th className="px-5 py-3">Stok</th>
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
                      Tidak ada produk ditemukan.
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
                            <div className="font-bold text-gray-900">{prod.name}</div>
                            <div className="text-[11px] text-gray-400">{prod.weight}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-600">
                        {prod.category?.name || '-'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-brand-700">
                        {formatRupiah(prod.price)}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleUpdateStock(prod.id, prod.stock)}
                          className="px-2.5 py-1 rounded-lg border border-brand-200 bg-brand-50/60 hover:bg-brand-100 font-mono font-bold text-gray-800 transition text-[11px] flex items-center gap-1.5"
                          title="Klik untuk ubah stok"
                        >
                          <span>{prod.stock} pcs</span>
                          <Edit2 className="w-3 h-3 text-brand-600" />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        {prod.stock > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Tersedia
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Habis
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition"
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

          {/* Mobile Cards View (Optimized for Mobile Screens) */}
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
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="text-gray-400 hover:text-rose-600 p-1 shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {prod.category?.name} • {prod.weight}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                      <span className="text-xs font-bold text-brand-700">
                        {formatRupiah(prod.price)}
                      </span>

                      <button
                        onClick={() => handleUpdateStock(prod.id, prod.stock)}
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

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-brand-200">
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

            <form onSubmit={handleAddProduct} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Arabika Toraja Kalosi 250g"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Ukuran / Berat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 250 gram"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Harga Jual *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Harga Coret
                  </label>
                  <input
                    type="number"
                    placeholder="95000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  URL Foto Produk
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan keistimewaan rasa, asal biji kopi atau resep bahan alami..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <label htmlFor="featured" className="text-xs text-gray-700 font-medium">
                  Jadikan Produk Unggulan (Tampil dengan badge Pilihan)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
