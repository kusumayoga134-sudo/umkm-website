import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      deliveryNotes,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Data pemesan dan item produk tidak lengkap' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        deliveryNotes: deliveryNotes || null,
        paymentMethod: paymentMethod || 'QRIS',
        status: 'PENDING',
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Reduce stock of each ordered product
    for (const item of items) {
      if (item.productId) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } catch (stockErr) {
          console.warn('Failed to decrement stock for product', item.productId, stockErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}
