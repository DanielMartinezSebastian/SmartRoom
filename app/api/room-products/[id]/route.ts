import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateRoomProductSchema = z.object({
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK']).optional(),
  stock: z.number().min(0, 'Stock must be positive').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomProduct = await prisma.roomProduct.findUnique({
      where: { id },
      include: {
        Product: true,
        Room: true,
      },
    });

    if (!roomProduct) {
      return NextResponse.json({ error: 'Room product not found' }, { status: 404 });
    }

    return NextResponse.json(roomProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateRoomProductSchema.parse(body);

    const roomProduct = await prisma.roomProduct.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(roomProduct);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.roomProduct.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Room product deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
