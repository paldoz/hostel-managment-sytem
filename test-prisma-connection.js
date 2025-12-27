
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Attempting to connect to database...');
    try {
        const students = await prisma.student.findMany();
        console.log('Successfully connected!');
        console.log('Student count:', students.length);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
