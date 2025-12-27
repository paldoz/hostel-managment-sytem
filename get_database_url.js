const fs = require('fs');
try {
    const env = fs.readFileSync('.env', 'utf8');
    const lines = env.split('\n');
    const dbUrl = lines.find(line => line.startsWith('DATABASE_URL'));
    if (dbUrl) {
        // Extract just the value part (after the =)
        const value = dbUrl.split('=')[1].trim().replace(/"/g, '');
        console.log('\n========================================');
        console.log('Copy this value for Vercel:');
        console.log('========================================');
        console.log(value);
        console.log('========================================\n');
    } else {
        console.log('DATABASE_URL not found in .env file');
    }
} catch (e) {
    console.error('Error:', e.message);
}
