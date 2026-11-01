import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memuat detail produk' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
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

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && {
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId && { categoryId }),
        ...(imageUrl && { imageUrl }),
        ...(weight && { weight }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui produk' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
