const { Client } = require('pg');

// We use the direct IP to avoid DNS issues
const config = {
    user: 'postgres',
    host: '52.49.20.125',
    database: 'postgres',
    password: 'paldoz@@123',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

async function test() {
    const client = new Client(config);
    try {
        console.log('Connecting to Supabase (Direct IP)...');
        await client.connect();
        console.log('SUCCESS: Authenticated successfully!');
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Info:', res.rows[0]);
    } catch (err) {
        console.error('FAILED:', err.message);
    } finally {
        await client.end();
    }
}

test();
