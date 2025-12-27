// Add targetStudentIds column to Announcement table
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function addColumn() {
    try {
        console.log('Connecting to database...');

        // Check if column exists
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='Announcement' AND column_name='targetStudentIds';
        `;

        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.length > 0) {
            console.log('Column targetStudentIds already exists!');
        } else {
            console.log('Adding targetStudentIds column...');

            const alterQuery = `
                ALTER TABLE "Announcement" 
                ADD COLUMN "targetStudentIds" TEXT[] DEFAULT '{}';
            `;

            await pool.query(alterQuery);
            console.log('✓ Column added successfully!');
        }

        pool.end();
    } catch (error) {
        console.error('Error:', error.message);
        pool.end();
    }
}

addColumn();
