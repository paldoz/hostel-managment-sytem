const { PrismaClient } = require('@prisma/client')

const projectId = 'lcavtoygisveiarbteym'
const encodedPassword = 'paldoz%40%40123'
const regions = ['eu-west-1', 'us-east-1', 'us-west-1', 'eu-central-1', 'ap-southeast-1']

async function main() {
    for (const region of regions) {
        const url = `postgresql://postgres.${projectId}:${encodedPassword}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`
        console.log(`Testing region: ${region}`)
        const prisma = new PrismaClient({ datasources: { db: { url } } })
        try {
            await prisma.$connect()
            console.log(`SUCCESS in ${region}! URL: ${url.replace(encodedPassword, '****')}`)
            await prisma.$disconnect()
            process.exit(0)
        } catch (e) {
            console.log(`FAILED: ${e.message.split('\n')[0]}`)
            await prisma.$disconnect()
        }
    }
}

main()
