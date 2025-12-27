const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to fetch rooms from Cloud DB...')
        const rooms = await prisma.room.findMany()
        console.log(`SUCCESS! Found ${rooms.length} rooms.`)
        console.log('Connection and tables are verified.')
    } catch (e) {
        console.error('QUERY FAILED:')
        console.error(e.message)
        if (e.code === 'P2021') {
            console.error('REASON: Tables still do not exist on Supabase.')
        }
    } finally {
        await prisma.$disconnect()
    }
}

main()
