import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roomProductSchema } from '@/lib/validations/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    const roomProducts = await prisma.roomProduct.findMany({
      where: roomId ? { roomId } : undefined,
      include: {
        Product: true,
        Room: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(roomProducts);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = roomProductSchema.parse(body);

    const roomProduct = await prisma.roomProduct.create({
      data: validated,
    });

    return NextResponse.json(roomProduct, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
