const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.lcavtoygisveiarbteym:paldoz%23%23123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    }
})

async function main() {
    try {
        console.log('Testing connection with Pooler on port 6543...')
        await prisma.$connect()
        console.log('Connection successful!')
    } catch (e) {
        console.error('Connection failed:')
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
