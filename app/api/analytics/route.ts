import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        // 1. Fee Stats
        const fees = await prisma.fee.findMany(studentId ? { where: { studentId } } : {});
        const totalFees = fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0); // Total Revenue = Paid only
        const collectedFees = totalFees; // Alias for clarity
        const pendingFees = fees.filter(f => f.status === 'pending').reduce((acc, f) => acc + f.amount, 0);

        // 2. Room Occupancy
        let rooms = [];
        let totalCapacity = 0;
        let totalOccupied = 0;
        let occupancyRate = 0;

        if (studentId) {
            // optimized for student: get only their room
            const student = await prisma.student.findUnique({
                where: { studentId },
                select: { room: true }
            });
            if (student && student.room) {
                rooms = await prisma.room.findMany({ where: { number: student.room } });
            }
            // For single student view, these totals might represent their room's status
            totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
            totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
            occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
        } else {
            // Admin: get all rooms
            rooms = await prisma.room.findMany({ orderBy: { number: 'asc' } });
            totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
            totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
            occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
        }

        // 3. Complaint Stats
        const complaints = await prisma.complaint.findMany(studentId ? { where: { studentId } } : {});
        const totalComplaints = complaints.length;
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
        const pendingComplaints = totalComplaints - resolvedComplaints;

        // 4. Monthly Collection (Student sees only their payments)
        const monthlyStats = fees.reduce((acc: any, f) => {
            const month = f.month;
            if (!acc[month]) acc[month] = { month, collected: 0, pending: 0 };
            if (f.status === 'paid') acc[month].collected += f.amount;
            else acc[month].pending += f.amount;
            return acc;
        }, {});

        return NextResponse.json({
            fees: {
                total: totalFees,
                collected: collectedFees,
                pending: pendingFees,
                monthly: Object.values(monthlyStats)
            },
            rooms: {
                capacity: totalCapacity,
                occupied: totalOccupied,
                rate: occupancyRate,
                details: rooms // Student gets only their room, Admin gets all
            },
            complaints: {
                total: totalComplaints,
                resolved: resolvedComplaints,
                pending: pendingComplaints
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
