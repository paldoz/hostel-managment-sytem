const { PrismaClient } = require('@prisma/client')

const projectId = 'lcavtoygisveiarbteym'
const encodedPassword = 'paldoz%40%40123'
const url = `postgresql://postgres.${projectId}:${encodedPassword}@52.49.20.125:6543/postgres?pgbouncer=true`

async function main() {
    console.log('Testing with Direct IP Pooler...')
    const prisma = new PrismaClient({ datasources: { db: { url } } })
    try {
        await prisma.$connect()
        console.log('SUCCESS: Connected to Supabase!')
        await prisma.$disconnect()
    } catch (e) {
        console.error('FAILED:', e.message.split('\n')[0])
        await prisma.$disconnect()
    }
}

main()
