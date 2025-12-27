const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sql = `
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "feeStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "joinDate" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Room" (
    "id" TEXT PRIMARY KEY,
    "number" TEXT UNIQUE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "occupied" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS "Fee" (
    "id" TEXT PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "date" TEXT
);

CREATE TABLE IF NOT EXISTS "Complaint" (
    "id" TEXT PRIMARY KEY,
    "complaintId" TEXT UNIQUE NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "date" TEXT NOT NULL
);
`;

async function main() {
    try {
        console.log('Connecting to initialize tables...')
        const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
        for (const statement of statements) {
            console.log(`Running: ${statement.substring(0, 50)}...`)
            await prisma.$executeRawUnsafe(statement)
        }
        console.log('SUCCESS: All tables created manually via Prisma!')
    } catch (err) {
        console.error('FAILED TO INITIALIZE TABLES:')
        console.error(err.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
