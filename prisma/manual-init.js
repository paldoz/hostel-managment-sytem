const { Client } = require('pg');

const connectionString = "postgresql://postgres.lcavtoygisveiarbteym:paldoz##123@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?sslmode=require";

const sql = `
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "feeStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "joinDate" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Room" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "occupied" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'available',

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Fee" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "date" TEXT,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Complaint" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "date" TEXT NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Student_studentId_key" ON "Student"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "Room_number_key" ON "Room"("number");
CREATE UNIQUE INDEX IF NOT EXISTS "Complaint_complaintId_key" ON "Complaint"("complaintId");
`;

async function main() {
    const client = new Client({ connectionString });
    try {
        console.log('Connecting to Supabase...');
        await client.connect();
        console.log('Running SQL...');
        await client.query(sql);
        console.log('SUCCESS: Tables created manually!');
    } catch (err) {
        console.error('FAILED:', err.message);
    } finally {
        await client.end();
    }
}

main();
