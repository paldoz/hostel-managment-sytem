const { Client } = require('pg');

const config = {
    user: 'postgres.lcavtoygisveiarbteym',
    host: '52.209.89.87', // aws-0-eu-west-1.pooler.supabase.com
    database: 'postgres',
    password: 'paldoz@@123',
    port: 6543,
    ssl: { rejectUnauthorized: false }
};

async function test() {
    const client = new Client(config);
    try {
        console.log('Connecting to Supabase Pooler (Direct IP)...');
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
