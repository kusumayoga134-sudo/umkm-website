import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status pesanan tidak valid' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengubah status pesanan' },
      { status: 500 }
    );
  }
}
