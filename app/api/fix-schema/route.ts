import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    console.log('--- EMERGENCY DB FIX START ---');
    let log = [];
    const poolerUrl = "postgresql://postgres.lcavtoygisveiarbteym:paldoz%40%40123@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true";
    const tempPrisma = new PrismaClient({
        datasources: { db: { url: poolerUrl } }
    });

    try {
        const queries = [
            `ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "password" TEXT DEFAULT 'student123' NOT NULL;`,
            `ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "avatar" TEXT;`,
            `CREATE TABLE IF NOT EXISTS "Announcement" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'info',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
      );`,
            `ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "password" TEXT DEFAULT 'student123' NOT NULL;`,
            `ALTER TABLE "student" ADD COLUMN IF NOT EXISTS "avatar" TEXT;`
        ];

        for (const sql of queries) {
            try {
                log.push(`Executing: ${sql}`);
                await tempPrisma.$executeRawUnsafe(sql);
                log.push('SUCCESS');
            } catch (e) {
                log.push(`FAILED: ${e.message}`);
            }
        }

        await tempPrisma.$disconnect();
        return NextResponse.json({ success: true, log });
    } catch (err) {
        if (tempPrisma) await tempPrisma.$disconnect();
        return NextResponse.json({ success: false, error: err.message, log }, { status: 500 });
    }
}
