import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const students = await prisma.student.findMany();
  // Map Prisma 'studentId' (e.g. STU001) to 'id' for frontend compatibility if needed, 
  // but frontend handles 'id' property. My schema has 'studentId' as the physical ID. 
  // Wait, frontend uses 'id' for STU001. So I should make sure my schema matches or map it.
  // My schema: studentId (String @unique), id (String @default(cuid))
  // Frontend expects { id: 'STU001', ... }
  // I will return objects where 'id' is the studentId and '_id' is the database id (good practice)
  // or just return as is if I fix frontend. 
  // EASIER: Update routes to map fields.
  const formatted = students.map(s => ({
    ...s,
    id: s.studentId, // Map physical ID to 'id' for frontend
    _dbId: s.id      // Keep internal ID hidden or under proper name
  }));
  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    // 1. Check Room Capacity
    const room = await prisma.room.findUnique({
      where: { number: data.room }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.occupied >= room.capacity) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    }

    // Generate automatic avatar if not provided
    const avatar = data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id || Date.now()}`;

    // 2. Transaction: Create Student & Update Room
    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          studentId: data.id,
          name: data.name,
          phone: data.phone,
          room: data.room,
          feeStatus: data.feeStatus,
          joinDate: data.joinDate,
          email: data.email,
          avatar: avatar
        }
      });

      const newOccupancy = room.occupied + 1;
      let newStatus = 'available';
      if (newOccupancy >= room.capacity) {
        newStatus = 'full';
      } else if (newOccupancy > 0) {
        newStatus = 'occupied';
      }

      await tx.room.update({
        where: { number: data.room },
        data: {
          occupied: newOccupancy,
          status: newStatus
        }
      });

      return student;
    });

    return NextResponse.json({ ...result, id: result.studentId });
  } catch (e: any) {
    console.error('Student creation fee error:', e);
    // Return a more descriptive error if possible
    const message = e.code === 'P2002'
      ? `Student ID already exists: ${data.id}`
      : 'Failed to create student';

    return NextResponse.json({ error: message, details: e.message }, { status: 500 });
  }
}
