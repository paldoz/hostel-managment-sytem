import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const fees = await prisma.fee.findMany();
    return NextResponse.json(fees);
}

export async function POST(request: Request) {
    const data = await request.json();

    try {
        const result = await prisma.$transaction(async (tx) => {
            const fee = await tx.fee.create({
                data: {
                    studentId: data.studentId,
                    month: data.month,
                    amount: parseFloat(data.amount),
                    status: data.status || 'pending', // Default to 'pending' for student requests
                    date: data.date || new Date().toISOString().split('T')[0]
                }
            });

            // If it's a direct 'paid' record from admin, update student status too
            if (data.status === 'paid') {
                await tx.student.update({
                    where: { studentId: data.studentId },
                    data: { feeStatus: 'paid' }
                });
            }

            return fee;
        });

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to record fee' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const data = await request.json();
    const { feeId, status } = data;

    if (!feeId) return NextResponse.json({ error: 'Fee ID required' }, { status: 400 });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const updatedFee = await tx.fee.update({
                where: { id: feeId },
                data: { status }
            });

            if (status === 'paid') {
                await tx.student.update({
                    where: { studentId: updatedFee.studentId },
                    data: { feeStatus: 'paid' }
                });
            }

            return updatedFee;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Approval failed:', error);
        return NextResponse.json({ error: 'Failed to update fee status' }, { status: 500 });
    }
}
