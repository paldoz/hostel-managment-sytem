import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json();
  try {
    const complaint = await prisma.complaint.update({
      where: { complaintId: params.id },
      data: { status: data.status }
    });
    return NextResponse.json({ ...complaint, id: complaint.complaintId });
  } catch (e) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
