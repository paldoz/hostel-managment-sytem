const { Client } = require('pg');

const connectionString = "postgresql://postgres.lcavtoygisveiarbteym:paldoz##123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require";

const client = new Client({
    connectionString: connectionString,
});

async function testAuth() {
    try {
        console.log('Attempting to connect with pg client...');
        await client.connect();
        console.log('Authentication Successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0]);
    } catch (err) {
        console.error('Authentication Failed:');
        console.error(err.message);
    } finally {
        await client.end();
    }
}

testAuth();
