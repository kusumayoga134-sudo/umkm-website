import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memuat ulasan pelanggan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, roleOrCity, rating, comment } = body;

    if (!customerName || !comment) {
      return NextResponse.json(
        { success: false, error: 'Nama dan ulasan wajib diisi' },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        customerName,
        roleOrCity: roleOrCity || 'Pelanggan Setia',
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        comment,
        isApproved: true,
      },
    });

    return NextResponse.json({ success: true, data: newTestimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengirim ulasan' },
      { status: 500 }
    );
  }
}
