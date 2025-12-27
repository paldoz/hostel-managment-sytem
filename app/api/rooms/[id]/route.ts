import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // params.id is the room number (e.g. R101)
    await prisma.room.delete({
      where: { number: params.id }
    });
    return NextResponse.json({ message: 'Room deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
