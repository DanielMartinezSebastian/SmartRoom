import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userSchema } from '@/lib/validations/user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      include: {
        room: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating user with data:', body);
    
    const validated = userSchema.parse(body);
    console.log('Validated data:', validated);

    const user = await prisma.user.create({
      data: validated,
    });

    console.log('User created successfully:', user);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    const errorCode = error.code || 'UNKNOWN';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        details: error.meta || error.toString()
      }, 
      { status: 400 }
    );
  }
}
