const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function main() {
    let log = ''
    try {
        log += 'Attempting raw SELECT from "Announcement"...\n'
        // Use the exact same query as the route
        const announcements = await prisma.$queryRaw`SELECT * FROM "Announcement" ORDER BY "createdAt" DESC`
        log += 'SUCCESS: ' + JSON.stringify(announcements, null, 2) + '\n'
    } catch (e) {
        log += 'FAILED\n'
        log += 'Error Name: ' + e.name + '\n'
        log += 'Error Message: ' + e.message + '\n'
        log += 'Code: ' + e.code + '\n'
        log += 'Meta: ' + JSON.stringify(e.meta) + '\n'
    } finally {
        fs.writeFileSync('raw_sql_diag.txt', log)
        await prisma.$disconnect()
    }
}

main()
