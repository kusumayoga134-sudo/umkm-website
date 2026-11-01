import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding UMKM database...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Create Categories
  const catKopi = await prisma.category.create({
    data: {
      name: 'Kopi Nusantara',
      slug: 'kopi-nusantara',
      description: 'Biji kopi pilihan single origin sangrai segar dari petani lokal Indonesia.',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    },
  });

  const catCamilan = await prisma.category.create({
    data: {
      name: 'Camilan Sehat',
      slug: 'camilan-sehat',
      description: 'Kudapan gurih & manis alami tanpa bahan pengawet kimia.',
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    },
  });

  const catSambal = await prisma.category.create({
    data: {
      name: 'Sambal & Bumbu',
      slug: 'sambal-dan-bumbu',
      description: 'Sambal racikan tradisional warisan resep nusantara dengan rempah asli.',
      imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=600&q=80',
    },
  });

  const catHampers = await prisma.category.create({
    data: {
      name: 'Hampers & Kado',
      slug: 'hampers-dan-kado',
      description: 'Paket bingkisan eksklusif kerajinan & olahan UMKM untuk momen istimewa.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Create Products
  const products = [
    {
      name: 'Kopi Arabika Gayo Single Origin 250g',
      slug: 'kopi-arabika-gayo-250g',
      description: 'Biji kopi Arabika asli Takengon Aceh Gayo. Karakter rasa earthy, hint of dark chocolate, dan acidity yang lembut seimbang. Disangrai medium roast secara berkala untuk menjaga kesegaran aroma.',
      price: 85000,
      originalPrice: 95000,
      stock: 35,
      categoryId: catKopi.id,
      imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
      weight: '250 gram',
      rating: 4.9,
      isFeatured: true,
      isAvailable: true,
    },
    {
      name: 'Kopi Robusta Temanggung Fine Java 250g',
      slug: 'kopi-robusta-temanggung-250g',
      description: 'Robusta petik merah dari lereng Gunung Sindoro & Sumbing Temanggung. Body tebal, aroma karamel nutty, dan crema tebal cocok untuk seduhan tubruk, Vietnam Drip, maupun espresso based.',
      price: 65000,
      originalPrice: 75000,
      stock: 50,
      categoryId: catKopi.id,
      imageUrl: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=600&q=80',
      weight: '250 gram',
      rating: 4.8,
      isFeatured: false,
      isAvailable: true,
    },
    {
      name: 'Cold Brew Concentrate Nusantara 500ml',
      slug: 'cold-brew-concentrate-500ml',
      description: 'Konsentrat seduh dingin dari perpaduan biji kopi Flores Bajawa & Bali Kintamani. Diseduh lambat 18 jam, rendah asam lambung, siap campur dengan susu oat atau air es.',
      price: 60000,
      originalPrice: null,
      stock: 20,
      categoryId: catKopi.id,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      weight: '500 ml',
      rating: 5.0,
      isFeatured: true,
      isAvailable: true,
    },
    {
      name: 'Keripik Pisang Lumer Cokelat Premium',
      slug: 'keripik-pisang-lumer-cokelat',
      description: 'Keripik pisang kepok pilihan khas Lampung dengan balutan cokelat leleh Belgian style tebal yang legit dan renyah. Tidak seret di tenggorokan dan bebas pemanis buatan.',
      price: 38000,
      originalPrice: 45000,
      stock: 60,
      categoryId: catCamilan.id,
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
      weight: '200 gram',
      rating: 4.9,
      isFeatured: true,
      isAvailable: true,
    },
    {
      name: 'Kacang Mede Oven Rasa Bawang Gurih',
      slug: 'kacang-mede-oven-bawang',
      description: 'Kacang mete kualitas super Wonogiri yang dipanggang oven (bukan digoreng). Renyah, resep bawang putih segar alami, kaya lemak baik dan bebas kolesterol berlebih.',
      price: 75000,
      originalPrice: 85000,
      stock: 25,
      categoryId: catCamilan.id,
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
      weight: '250 gram',
      rating: 4.9,
      isFeatured: false,
      isAvailable: true,
    },
    {
      name: 'Sambal Cakalang Asap Suwir Manado 200g',
      slug: 'sambal-cakalang-asap-manado',
      description: 'Daging ikan cakalang asap melimpah berpadu dengan cabai rawit merah dan minyak kelapa murni. Gurih pedas nendang, praktis untuk lauk nasi hangat seketika.',
      price: 48000,
      originalPrice: 55000,
      stock: 40,
      categoryId: catSambal.id,
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
      weight: '200 gram',
      rating: 5.0,
      isFeatured: true,
      isAvailable: true,
    },
    {
      name: 'Sambal Bawang Kecombrang Wangi 200g',
      slug: 'sambal-bawang-kecombrang',
      description: 'Inovasi sambal bawang beraroma bunga kecombrang (honje) segar. Sensasi rasa asam floral segar berpadu pedas gurih yang menggugah selera.',
      price: 42000,
      originalPrice: null,
      stock: 30,
      categoryId: catSambal.id,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      weight: '200 gram',
      rating: 4.7,
      isFeatured: false,
      isAvailable: true,
    },
    {
      name: 'Paket Hampers Karsa Nusantara Signature',
      slug: 'paket-hampers-karsa-nusantara',
      description: 'Kotak anyaman bambu ramah lingkungan berisi 1 Kopi Gayo 250g, 1 Sambal Cakalang, 1 Pisang Lumer Cokelat, cangkir enamel klasik, dan kartu ucapan kustom.',
      price: 245000,
      originalPrice: 280000,
      stock: 15,
      categoryId: catHampers.id,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      weight: '1200 gram',
      rating: 5.0,
      isFeatured: true,
      isAvailable: true,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // Create Testimonials
  const testimonials = [
    {
      customerName: 'Dian Prasetyo',
      roleOrCity: 'Penikmat Kopi - Jakarta Selatan',
      rating: 5,
      comment: 'Kopi Arabika Gayonya beneran fresh roasting! Aromanya semerbak satu ruangan pas diseduh V60. Pengemasan super aman dan pengiriman cepet banget.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      customerName: 'Ratna Wulandari',
      roleOrCity: 'Ibu Rumah Tangga - Bandung',
      rating: 5,
      comment: 'Sambal cakalang asapnya juara! Suwiran ikannya banyak banget dan ga pelit, pedesnya pas mantap dimakan sama nasi anget. Bakal langganan rutin!',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      customerName: 'Budi Santoso',
      roleOrCity: 'Corporate HR - Surabaya',
      rating: 5,
      comment: 'Pesan 30 box Hampers Karsa Nusantara untuk bingkisan klien kantor. Kemasannya sangat elegan dan etnik, semua klien memberi respon sangat positif!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  for (const test of testimonials) {
    await prisma.testimonial.create({ data: test });
  }

  // Create Sample Order
  const createdOrder = await prisma.order.create({
    data: {
      orderNumber: 'KRS-20261101-001',
      customerName: 'Farhan Maulana',
      customerPhone: '081298765432',
      customerEmail: 'farhan@example.com',
      customerAddress: 'Jl. Merdeka No. 45, Menteng, Jakarta Pusat',
      deliveryNotes: 'Tolong titip di pos satpam bila rumah kosong',
      paymentMethod: 'QRIS',
      status: 'PROCESSING',
      totalAmount: 170000,
      items: {
        create: [
          {
            productName: 'Kopi Arabika Gayo Single Origin 250g',
            price: 85000,
            quantity: 2,
            subtotal: 170000,
          },
        ],
      },
    },
  });

  // Create Sample Contact Message
  await prisma.contactMessage.create({
    data: {
      name: 'Maya Indriati',
      email: 'maya.cafe@example.com',
      phone: '081344556677',
      subject: 'Penawaran Kerjasama Supplier Kafe',
      message: 'Halo admin Karsa Rasa, kami tertarik untuk memesan biji kopi Arabika Gayo dalam kapasitas 20kg per bulan untuk kebutuhan kafe kami di Bogor. Mohon info harga grosir.',
      isRead: false,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
