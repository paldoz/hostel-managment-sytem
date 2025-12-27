import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const { studentId, password } = await req.json()

        const student = await prisma.student.findUnique({
            where: { studentId }
        })

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 })
        }

        // Check password from database
        if (student.password !== password) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
        }

        return NextResponse.json({
            id: student.studentId,
            name: student.name,
            role: 'student'
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
