import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      stock,
      categoryId,
      imageUrl,
      weight,
      isFeatured,
      isAvailable,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Nama produk, harga, dan kategori wajib diisi' },
        { status: 400 }
      );
    }

    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description: description || '',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock) || 0,
        categoryId,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
        weight: weight || '250 gram',
        isFeatured: Boolean(isFeatured),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}
