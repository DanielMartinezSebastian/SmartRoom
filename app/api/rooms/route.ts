import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roomSchema } from '@/lib/validations/room';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        User: true,
        RoomProduct: {
          include: {
            Product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = roomSchema.parse(body);

    const room = await prisma.room.create({
      data: validated,
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
