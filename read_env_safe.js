const fs = require('fs');
try {
    const env = fs.readFileSync('.env', 'utf8');
    const masked = env.replace(/(postgres:\/\/.*:)(.*)(@.*)/g, '$1****$3');
    console.log(masked);
} catch (e) {
    console.error(e.message);
}
