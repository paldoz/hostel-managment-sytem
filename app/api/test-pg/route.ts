import { NextResponse } from 'next/server';
const { Client } = require('pg');

export async function GET() {
    // Hardcode the URL with IP for a quick test
    const dbUrl = "postgres://postgres:Abdi2024@52.59.152.35:6543/postgres?pgbouncer=true";
    const client = new Client({
        connectionString: dbUrl,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        await client.end();
        return new Response('SUCCESS: ' + JSON.stringify(res.rows[0]));
    } catch (e: any) {
        return new Response('ERROR: ' + e.message, { status: 500 });
    }
}
