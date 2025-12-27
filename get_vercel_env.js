const fs = require('fs');
try {
    const env = fs.readFileSync('.env', 'utf8');
    const lines = env.split('\n');
    const dbUrl = lines.find(line => line.startsWith('DATABASE_URL'));
    if (dbUrl) {
        const value = dbUrl.split('=')[1].trim().replace(/"/g, '');
        console.log('\n==============================================');
        console.log('VERCEL ENVIRONMENT VARIABLE:');
        console.log('==============================================');
        console.log('\nKey:');
        console.log('DATABASE_URL');
        console.log('\nValue (copy this EXACTLY):');
        console.log(value);
        console.log('\n==============================================\n');
    }
} catch (e) {
    console.error('Error:', e.message);
}
