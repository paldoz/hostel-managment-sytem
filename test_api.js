const http = require('http');

const url = 'http://localhost:3000/api/students';

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data.substring(0, 200));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
