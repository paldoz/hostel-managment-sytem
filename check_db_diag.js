const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function main() {
    let log = ''
    try {
        log += 'Checking tables...\n'
        const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
        log += 'Tables: ' + JSON.stringify(tables, null, 2) + '\n'

        log += 'Attempting to count announcements...\n'
        const count = await prisma.announcement.count()
        log += 'Announcement count: ' + count + '\n'
    } catch (e) {
        log += 'Error: ' + e.message + '\n'
        log += 'Stack: ' + e.stack + '\n'
    } finally {
        fs.writeFileSync('diag_output.txt', log)
        await prisma.$disconnect()
    }
}

main()
