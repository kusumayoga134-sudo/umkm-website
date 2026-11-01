import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalProducts, totalOrders, pendingOrders, totalMessages, orders] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.contactMessage.count({ where: { isRead: false } }),
        prisma.order.findMany({
          select: { totalAmount: true, status: true },
        }),
      ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        unreadMessages: totalMessages,
        totalRevenue,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik dashboard' },
      { status: 500 }
    );
  }
}
