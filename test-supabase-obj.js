const { Client } = require('pg');

async function testConnection() {
    const client = new Client({
        user: 'postgres.lcavtoygisveiarbteym',
        host: 'aws-0-eu-west-1.pooler.supabase.com',
        database: 'postgres',
        password: 'paldoz@@123',
        port: 6543,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to Supabase Pooler...');
        await client.connect();
        console.log('SUCCESS: Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Database Time:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('CONNECTION FAILED:', err.message);
        if (err.detail) console.error('Detail:', err.detail);
        if (err.hint) console.error('Hint:', err.hint);
    }
}

testConnection();
