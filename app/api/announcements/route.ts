import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Add targetStudentIds processing
        const enhancedAnnouncements = announcements.map(ann => {
            let targets: string[] = [];
            try {
                // Parse JSON if it's a string, or use as is if somehow array
                if (typeof ann.targetStudentIds === 'string' && ann.targetStudentIds.startsWith('[')) {
                    targets = JSON.parse(ann.targetStudentIds);
                } else if (typeof ann.targetStudentIds === 'string' && ann.targetStudentIds.length > 0) {
                    // Fallback for CSV or plain string/single ID
                    targets = [ann.targetStudentIds];
                }
            } catch (e) {
                targets = [];
            }

            return {
                ...ann,
                targetStudentIds: targets
            };
        });

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

        // Ensure targetStudentIds is stored as a JSON string
        const targets = Array.isArray(data.targetStudentIds)
            ? JSON.stringify(data.targetStudentIds)
            : '[]';

        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                type: data.type || 'info',
                targetStudentIds: targets
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
