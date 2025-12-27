const { PrismaClient } = require('@prisma/client')

const url = "postgresql://postgres.lcavtoygisveiarbteym:paldoz%40%40123@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"

async function main() {
    const prisma = new PrismaClient({ datasources: { db: { url } } })
    try {
        console.log('Connecting to eu-west-3 pooler...')
        await prisma.$connect()
        console.log('SUCCESS! Cloud database is reachable.')
    } catch (e) {
        console.error('CONNECTION FAILED:', e.message.split('\n')[0])
    } finally {
        await prisma.$disconnect()
    }
}

main()
