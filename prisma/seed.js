const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const rooms = [
        { number: '101', capacity: 4 },
        { number: '102', capacity: 4 },
        { number: '201', capacity: 2 },
        { number: '202', capacity: 2 },
    ]

    console.log('Start seeding...')
    for (const r of rooms) {
        const room = await prisma.room.upsert({
            where: { number: r.number },
            update: {},
            create: {
                number: r.number,
                capacity: r.capacity,
                occupied: 0,
                status: 'available'
            },
        })
        console.log(`Created/Updated room: ${room.number}`)
    }
    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
