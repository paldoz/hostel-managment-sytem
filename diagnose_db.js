const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DIAGNOSTIC START ---');
    try {
        const rooms = await prisma.room.findMany();
        console.log(`Rooms found: ${rooms.length}`);
        rooms.forEach(r => console.log(`- Room: ${r.number}, Occupied: ${r.occupied}/${r.capacity}, Status: ${r.status}`));

        const students = await prisma.student.findMany();
        console.log(`\nStudents found: ${students.length}`);
        students.forEach(s => console.log(`- Student: ${s.name}, ID: ${s.studentId}, Room: ${s.room}`));

        const fees = await prisma.fee.findMany();
        console.log(`\nFees found: ${fees.length}`);

    } catch (err) {
        console.error('Database connection failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
    console.log('--- DIAGNOSTIC END ---');
}

main();
