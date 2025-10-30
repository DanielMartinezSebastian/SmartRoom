import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has permission to upload avatar
    // Only ADMIN or WORKER can change avatars
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'WORKER') {
      return NextResponse.json(
        { error: 'Only administrators and workers can change profile pictures' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { avatarUrl } = body;

    // Update user avatar
    const user = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
