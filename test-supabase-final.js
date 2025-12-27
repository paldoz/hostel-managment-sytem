const { PrismaClient } = require('@prisma/client')

const projectId = 'lcavtoygisveiarbteym'
const encodedPassword = 'paldoz%40%40123'

const urls = [
    // Option 1: Project host + Port 6543 + Full Username
    `postgresql://postgres.${projectId}:${encodedPassword}@db.${projectId}.supabase.co:6543/postgres?pgbouncer=true`,
    // Option 2: Project host + Port 6543 + Short Username
    `postgresql://postgres:${encodedPassword}@db.${projectId}.supabase.co:6543/postgres?pgbouncer=true`,
    // Option 3: Regional Pooler + Full Username
    `postgresql://postgres.${projectId}:${encodedPassword}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
]

async function main() {
    for (const url of urls) {
        console.log(`Testing: ${url.replace(encodedPassword, '****')}`)
        const prisma = new PrismaClient({ datasources: { db: { url } } })
        try {
            await prisma.$connect()
            console.log('SUCCESS!')
            await prisma.$disconnect()
            process.exit(0)
        } catch (e) {
            console.log(`FAILED: ${e.message.split('\n')[0]}`)
            await prisma.$disconnect()
        }
    }
}

main()
