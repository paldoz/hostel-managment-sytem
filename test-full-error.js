const { PrismaClient } = require('@prisma/client')

const url = "postgresql://postgres.lcavtoygisveiarbteym:paldoz%40%40123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

async function main() {
    const prisma = new PrismaClient({ datasources: { db: { url } } })
    try {
        console.log('Connecting...')
        await prisma.$connect()
        console.log('SUCCESS!')
    } catch (e) {
        console.log('--- ERROR START ---')
        console.log(JSON.stringify(e, null, 2))
        console.log(e.message)
        console.log('--- ERROR END ---')
    } finally {
        await prisma.$disconnect()
    }
}

main()
