import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const rooms = await prisma.room.findMany();
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const data = await request.json();
  const room = await prisma.room.create({
    data: {
      number: data.number,
      capacity: data.capacity,
      occupied: data.occupied,
      status: data.status
    }
  });
  return NextResponse.json(room);
}
