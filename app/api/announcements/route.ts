import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Add targetStudentIds if it doesn't exist (backwards compatibility)
        const enhancedAnnouncements = announcements.map(ann => ({
            ...ann,
            targetStudentIds: (ann as any).targetStudentIds || []
        }));

        // Filter announcements based on student ID
        // Show all announcements if no studentId (admin view)
        // Show only targeted or global announcements for students
        const filteredAnnouncements = studentId
            ? enhancedAnnouncements.filter(ann =>
                ann.targetStudentIds.length === 0 || ann.targetStudentIds.includes(studentId)
            )
            : enhancedAnnouncements;

        return NextResponse.json(Array.isArray(filteredAnnouncements) ? filteredAnnouncements : []);
    } catch (e) {
        console.error('Fetch announcements failed:', e);
        return NextResponse.json([]); // Return empty array instead of failing to prevent UI crash
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                type: data.type || 'info'
            }
        });
        return NextResponse.json(announcement);
    } catch (e) {
        console.error('Create announcement failed:', e);
        return NextResponse.json({ error: 'Failed to create', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.announcement.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (e) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
