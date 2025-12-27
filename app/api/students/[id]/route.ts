import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const student = await prisma.student.findUnique({
        where: { studentId: params.id }
    });
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    return NextResponse.json({ ...student, id: student.studentId });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const data = await request.json();
    try {
        const studentId = params.id;

        // Start Transaction to handle room changes safely
        const result = await prisma.$transaction(async (tx) => {
            const currentStudent = await tx.student.findUnique({ where: { studentId } });
            if (!currentStudent) throw new Error('Student not found');

            const oldRoomNum = currentStudent.room;
            const newRoomNum = data.room;

            // If room changed, handle occupancy
            if (newRoomNum && newRoomNum !== oldRoomNum) {
                // Check new room capacity
                const newRoom = await tx.room.findUnique({ where: { number: newRoomNum } });
                if (!newRoom) throw new Error('New room not found');
                if (newRoom.occupied >= newRoom.capacity) throw new Error('New room is full');

                // Decrement old room
                const oldRoom = await tx.room.findUnique({ where: { number: oldRoomNum } });
                if (oldRoom) {
                    await tx.room.update({
                        where: { number: oldRoomNum },
                        data: {
                            occupied: Math.max(0, oldRoom.occupied - 1),
                            status: 'available' // Freed up a spot
                        }
                    });
                }

                // Increment new room
                await tx.room.update({
                    where: { number: newRoomNum },
                    data: {
                        occupied: newRoom.occupied + 1,
                        status: (newRoom.occupied + 1) >= newRoom.capacity ? 'full' : 'available'
                    }
                });
            }

            // Update student
            // We specifically pick fields to avoid passing '_dbId' or other unknown props
            const updatedStudent = await tx.student.update({
                where: { studentId },
                data: {
                    studentId: data.id, // Allow updating the ID itself
                    name: data.name,
                    phone: data.phone,
                    room: data.room,
                    email: data.email,
                    joinDate: data.joinDate,
                    feeStatus: data.feeStatus,
                }
            });
            return updatedStudent;
        });

        return NextResponse.json({ ...result, id: result.studentId });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Update failed' }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.$transaction(async (tx) => {
            const student = await tx.student.findUnique({ where: { studentId: params.id } });
            if (!student) throw new Error('Student not found');

            await tx.student.delete({ where: { studentId: params.id } });

            // Decrement room occupancy
            const room = await tx.room.findUnique({ where: { number: student.room } });
            if (room) {
                const newOccupancy = Math.max(0, room.occupied - 1);
                await tx.room.update({
                    where: { number: student.room },
                    data: {
                        occupied: newOccupancy,
                        status: newOccupancy < room.capacity ? 'available' : 'full'
                    }
                });
            }
        });
        return NextResponse.json({ message: 'Student deleted' });
    } catch (e) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
    }
}
