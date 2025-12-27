const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking tables...')
        const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
        console.log('Tables in public schema:', tables)

        console.log('Checking Announcement table...')
        const count = await prisma.announcement.count()
        console.log('Announcement count:', count)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
