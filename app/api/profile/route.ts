import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
        return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    try {
        const student = await prisma.student.findUnique({
            where: { studentId }
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Return profile data along with fees and complaints
        const fees = await prisma.fee.findMany({ where: { studentId } });
        const complaints = await prisma.complaint.findMany({ where: { studentId } });

        return NextResponse.json({
            ...student,
            fees,
            complaints
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const data = await request.json();
    const { studentId, phone, email, avatar, password } = data;

    if (!studentId) {
        return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    try {
        const updated = await prisma.student.update({
            where: { studentId },
            data: {
                phone,
                email,
                avatar,
                password // In a real app, hash this!
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
