import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Fee Stats
        const fees = await prisma.fee.findMany();
        const totalFees = fees.reduce((acc, f) => acc + f.amount, 0);
        const collectedFees = fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0);
        const pendingFees = totalFees - collectedFees;

        // 2. Room Occupancy
        const rooms = await prisma.room.findMany();
        const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
        const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

        // 3. Complaint Stats
        const complaints = await prisma.complaint.findMany();
        const totalComplaints = complaints.length;
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
        const pendingComplaints = totalComplaints - resolvedComplaints;

        // 4. Monthly Collection (Simplified - grouping by month field)
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
                details: rooms
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
