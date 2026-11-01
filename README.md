# ☕ Karsa Rasa Nusantara - Website Fullstack UMKM E-Commerce

Website resmi untuk UMKM (**Usaha Mikro, Kecil, dan Menengah**) dengan arsitektur **Fullstack Modern**, mengintegrasikan Frontend interaktif dengan UI/UX elegan, Backend REST API (Next.js App Router), Database SQLite dengan Prisma ORM, serta Unit Testing menyeluruh menggunakan Jest.

---

## 🌟 Fitur Utama Website

### 1. 🛍️ Katalog Produk & Toko Online
- **Pencarian Cepat (Real-time Search)**: Menemukan produk berdasarkan nama atau deskripsi.
- **Filter Kategori**: Kopi Nusantara, Camilan Sehat, Sambal & Bumbu, Hampers & Kado.
- **Pengurutan (Sort)**: Berdasarkan produk terpopuler, harga terendah/tertinggi, rating bintang, dan nama A-Z.
- **Detail Produk (Modal Pop-up)**: Informasi berat bersih, deskripsi lengkap, stok sisa, rating, dan jaminan mutu.
- **Badge Dinamis**: Label *Pilihan*, *Diskon/Hemat*, dan indikator stok habis.

### 2. 🛒 Keranjang Belanja & Dual Checkout
- **Keranjang Belanja Geser (Cart Drawer)**: Tambah, kurang jumlah, hapus item, dan perhitungan subtotal instan.
- **Bebas Ongkir Otomatis**: Gratis biaya kirim untuk total belanja di atas Rp 200.000.
- **Dual Checkout System**:
  1. **Direct System Checkout**: Pembeli mengisi formulir pengiriman (Nama, No HP/WA, Alamat, Pilihan Pembayaran QRIS/Transfer/COD). Pesanan otomatis tersimpan di database SQLite dan mengurangi kuota stok.
  2. **Direct WhatsApp Checkout**: Otomatis menghasilkan format template pesan WhatsApp yang rapi dan terstruktur untuk langsung dikirim ke nomor kontak pemilik UMKM.

### 3. 🛡️ Panel Admin UMKM (`/admin`)
- **Dashboard Ringkasan**: Statistik total omset penjualan, total pesanan, jumlah pesanan menunggu konfirmasi, dan katalog produk aktif.
- **Manajemen Produk (`/admin/products`)**: Tambah produk baru dengan foto, ubah stok produk secara langsung, hapus produk.
- **Manajemen Pesanan (`/admin/orders`)**: Filter pesanan (Pending, Processing, Shipped, Completed, Cancelled), ubah status pesanan, dan tombol cepat hubungi pembeli via WhatsApp.
- **Kotak Masuk (`/admin/messages`)**: Membaca pesan pertanyaan kemitraan/reseller dari calon pembeli.

### 4. ⭐ Cerita Brand & Ulasan Pelanggan
- **Kisah UMKM (About Story)**: Narasi pemberdayaan petani kopi lokal dan ibu-ibu pengrajin bumbu.
- **Testimoni Interaktif**: Menampilkan review bintang 5 dari pelanggan asli dengan formulir untuk pengunjung menambahkan ulasan baru secara langsung.
- **Kontak & Peta**: Formulir pesan resmi, jam operasional, dan lokasi rumah produksi UMKM.
- **Tombol WhatsApp Mengambang (Floating Action Button)**: Tombol obrolan instan di sudut kanan bawah layar.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend API**: Next.js Route Handlers (`/api/products`, `/api/orders`, `/api/testimonials`, `/api/contact`, `/api/stats`).
- **Database & ORM**: SQLite (`prisma/dev.db`) + Prisma ORM 5.
- **Unit Testing**: Jest 29 + React Testing Library + ts-jest.
- **Styling & Feedback**: Tailwind CSS (skema warna warm earthy/amber/terracotta) & React Hot Toast.

---

## 📁 Struktur Folder Proyek

```
umkm-website/
├── __tests__/                  # Unit test Jest (Currency, Cart, Order, Filter, UI)
│   ├── cart.test.ts
│   ├── components.test.tsx
│   ├── currency.test.ts
│   ├── filter.test.ts
│   └── order.test.ts
├── prisma/
│   ├── schema.prisma           # Skema database SQLite (Category, Product, Order, dll)
│   ├── seed.ts                 # Script data awal (sample UMKM products)
│   └── dev.db                  # Database SQLite lokal
├── src/
│   ├── app/
│   │   ├── admin/              # Halaman Dashboard Admin UMKM
│   │   │   ├── messages/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── api/                # Backend REST API
│   │   │   ├── categories/
│   │   │   ├── contact/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── stats/
│   │   │   └── testimonials/
│   │   ├── globals.css         # Styling global Tailwind
│   │   ├── layout.tsx          # Root Layout & Cart Provider
│   │   └── page.tsx            # Halaman Utama (Homepage)
│   ├── components/             # Komponen UI Reusable
│   │   ├── AboutSection.tsx
│   │   ├── AdminNavbar.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCatalog.tsx
│   │   ├── ProductDetailModal.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── WhatsAppButton.tsx
│   ├── lib/
│   │   ├── cart-context.tsx    # State keranjang belanja & localStorage
│   │   ├── prisma.ts           # Koneksi Prisma Client singleton
│   │   └── utils.ts            # Utility Rupiah, WhatsApp URL generator, filter
│   └── types/
│       └── index.ts            # Definisi TypeScript interface
├── jest.config.js              # Konfigurasi Jest
├── package.json
└── README.md
```

---

## 💻 Panduan Menjalankan di Visual Studio Code (Langkah demi Langkah)

### 1. Buka Proyek di Visual Studio Code
1. Jalankan aplikasi **Visual Studio Code**.
2. Klik menu **File** > **Open Folder...** (atau tekan `Ctrl + K, Ctrl + O`).
3. Arahkan dan pilih folder:
   ```
   C:\Users\YOGA\.gemini\antigravity\scratch\umkm-website
   ```
4. Klik tombol **Select Folder**.

### 2. Buka Terminal Terintegrasi di VS Code
- Tekan kombinasi tombol **`Ctrl + \``** (tanda kutip terbalik di bawah tombol Esc), atau klik menu **Terminal** > **New Terminal**.

### 3. Setup Konfigurasi Lingkungan (`.env`)
Pastikan file `.env` sudah ada di root folder dengan konfigurasi:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="Karsa Rasa Nusantara"
NEXT_PUBLIC_UMKM_WHATSAPP="6281234567890"
```
*(Ganti `NEXT_PUBLIC_UMKM_WHATSAPP` dengan nomor WhatsApp pemilik UMKM Anda, gunakan awalan `62` tanpa tanda `+`)*.

### 4. Setup Database SQLite & Seed Data
Jalankan perintah berikut di terminal VS Code:
```bash
# Generate Prisma Client
npx prisma generate

# Sinkronisasi skema ke database SQLite dev.db
npx prisma db push

# Isi database dengan produk-produk UMKM awal (seed)
npm run db:seed
```

### 5. Jalankan Server Development
Ketik perintah berikut:
```bash
npm run dev
```
Setelah muncul tulisan `Ready in ...ms`, buka browser Anda dan akses:
- **Halaman Website Utama**: [http://localhost:3000](http://localhost:3000)
- **Panel Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 6. Melihat Database Melalui Prisma Studio (Opsional)
Jika Anda ingin melihat isi tabel database SQLite dalam antarmuka web interaktif:
```bash
npx prisma studio
```
Akses di browser pada [http://localhost:5555](http://localhost:5555).

---

## 🧪 Menjalankan Unit Testing (Jest)

Proyek ini telah dilengkapi dengan pengujian unit otomatis untuk memastikan semua logika aplikasi berjalan dengan benar:

```bash
# Menjalankan seluruh pengujian unit
npm test

# Menjalankan pengujian dengan laporan persentase cakupan kode (coverage)
npm run test:coverage
```

### Lingkup Unit Test yang Diuji:
1. **`currency.test.ts`**: Format angka mata uang Rupiah (`Rp 85.000`), penanganan nilai nol, angka besar, dan NaN.
2. **`cart.test.ts`**: Perhitungan subtotal, logika penentuan bebas ongkir (free shipping threshold Rp 200rb), kuantitas item.
3. **`order.test.ts`**: Format unik nomor pesanan (`KRS-YYYYMMDD-XXXX`) dan generator tautan WhatsApp pesanan.
4. **`filter.test.ts`**: Filter pencarian teks produk, filter berdasarkan kategori, pengurutan harga termurah/termahal, dan rating.
5. **`components.test.tsx`**: Render komponen UI (Hero heading, value proposition badges, CTA buttons) via React Testing Library.

---

## 🚀 Panduan Meng-upload ke GitHub

Ikuti langkah-langkah di bawah ini untuk mengunggah proyek ini ke akun GitHub Anda:

### Langkah 1: Buat Repository Baru di GitHub
1. Buka browser dan login ke akun [GitHub](https://github.com).
2. Klik tombol tanda tambah **(+)** di kanan atas > pilih **New repository**.
3. Masukkan nama repository, contoh: `umkm-karsa-rasa` atau `umkm-website`.
4. Pilih **Public** atau **Private** sesuai preferensi Anda.
5. **PENTING**: Jangan centang *"Initialize this repository with a README"* atau `.gitignore` (karena proyek lokal kita sudah memilikinya secara lengkap).
6. Klik tombol hijau **Create repository**.
7. Salin URL repository yang muncul (contoh: `https://github.com/username/umkm-website.git`).

### Langkah 2: Hubungkan & Push dari Terminal VS Code
Kembali ke terminal VS Code pada folder proyek, jalankan urutan perintah berikut:

```bash
# 1. Pastikan Anda berada di root folder proyek
git status

# 2. Tambahkan semua file ke staging
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi website fullstack UMKM lengkap dengan Prisma SQLite dan Jest"

# 4. Ubah nama branch utama menjadi 'main'
git branch -M main

# 5. Hubungkan repository lokal dengan repository GitHub Anda
# Ganti URL di bawah dengan URL repository GitHub yang Anda salin di Langkah 1!
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git

# 6. Unggah (push) file ke GitHub
git push -u origin main
```

*(Jika diminta login oleh GitHub, masukkan kredensial akun GitHub Anda atau gunakan GitHub Personal Access Token / Web Browser Login).*

---

## 🌐 Tips Deploy ke Produksi (Vercel)

Website Next.js ini siap di-deploy secara gratis ke **Vercel**:
1. Buka [Vercel](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik **Add New...** > **Project**.
3. Pilih repository GitHub yang baru saja Anda push.
4. Di bagian *Environment Variables*, masukkan:
   - `NEXT_PUBLIC_APP_NAME`: `Karsa Rasa Nusantara`
   - `NEXT_PUBLIC_UMKM_WHATSAPP`: `6281234567890`
5. Klik **Deploy**!
*(Catatan: Untuk deployment cloud di Vercel yang bersifat serverless, disarankan menggunakan database cloud seperti Turso/Neon/Supabase untuk SQLite/PostgreSQL, atau hubungkan Prisma via `DATABASE_URL`)*.

---

## 📄 Lisensi
Dilisensikan di bawah lisensi MIT. Bebas dimodifikasi dan dikembangkan untuk kemajuan UMKM Indonesia.
