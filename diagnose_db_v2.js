const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- START ---');
    try {
        const rooms = await prisma.room.findMany();
        console.log('ROOMS_DATA:' + JSON.stringify(rooms));

        const students = await prisma.student.findMany();
        console.log('STUDENTS_DATA:' + JSON.stringify(students));
    } catch (err) {
        console.log('ERROR:' + err.message);
    } finally {
        await prisma.$disconnect();
    }
    console.log('--- END ---');
}

main();
