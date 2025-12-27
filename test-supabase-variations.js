const { PrismaClient } = require('@prisma/client')

const urls = [
    "postgresql://postgres.lcavtoygisveiarbteym:paldoz%40%40123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    "postgresql://postgres:paldoz%40%40123@db.lcavtoygisveiarbteym.supabase.co:5432/postgres",
    "postgresql://postgres.lcavtoygisveiarbteym:paldoz%40%40123@db.lcavtoygisveiarbteym.supabase.co:5432/postgres",
    "postgresql://postgres:paldoz%40%40123@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
]

async function main() {
    for (const url of urls) {
        console.log(`Testing: ${url.replace('paldoz%40%40123', '****')}`)
        const prisma = new PrismaClient({ datasources: { db: { url } } })
        try {
            await prisma.$connect()
            console.log('SUCCESS!')
            await prisma.$disconnect()
            return
        } catch (e) {
            console.log(`FAILED: ${e.message.split('\n')[0]}`)
            await prisma.$disconnect()
        }
    }
}

main()
