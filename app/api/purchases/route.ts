import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { purchaseSchema } from '@/lib/validations/purchase';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        User: true,
        Product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(purchases);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = purchaseSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: dbUser.id,
        productId: validated.productId,
        quantity: validated.quantity,
        totalPrice: product.price * validated.quantity,
      },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
