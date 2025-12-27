import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    const complaints = await prisma.complaint.findMany();
    // Map fields similarly to students if needed, but for now direct return is likely fine
    // Front end might expect 'id' to be the readable one? 
    // Schema: id (internal), complaintId (CMP001). 
    // Let's check frontend: complaints.find(c => c.id === id).
    // So we should map complaintId -> id.
    const formatted = complaints.map(c => ({
        ...c,
        id: c.complaintId,
        _dbId: c.id
    }));
    return NextResponse.json(formatted);
}

export async function POST(request: Request) {
    const data = await request.json();
    // Generate CMP ID here or in frontend? Frontend generates it.
    // Frontend sends: { id: 'CMP...', ... } (Wait earlier frontend code sent 'id')
    // Let's check frontend. Frontend sends: studentId, studentName, category, description, status, date.
    // Frontend generates ID in frontend code? YES: "id: 'CMP' + Date.now()"
    // So I should expect 'id' in body? 
    // Wait, my previous refactor of frontend REMOVED the ID generation and let backend do it?
    // Let's check `app/(dashboard)/dashboard/complaints/page.tsx` handleSubmit.
    // ... "body: JSON.stringify({ studentId... })" -> It does NOT send 'id'.
    // So I must generate it here.

    const complaintId = 'CMP' + Date.now();

    const complaint = await prisma.complaint.create({
        data: {
            complaintId: complaintId,
            studentId: data.studentId,
            studentName: data.studentName,
            category: data.category,
            description: data.description,
            status: data.status,
            date: data.date
        }
    });
    return NextResponse.json({ ...complaint, id: complaint.complaintId });
}
