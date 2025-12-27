const net = require('net');

const client = new net.Socket();
const host = 'aws-0-eu-west-1.pooler.supabase.com';
const port = 6543;

console.log(`Connecting to ${host}:${port}...`);

client.connect(port, host, function () {
    console.log('TCP Connection Successful!');
    client.destroy();
});

client.on('error', function (err) {
    console.error('TCP Connection Failed:', err.message);
    client.destroy();
});

client.setTimeout(10000, function () {
    console.error('TCP Connection Timed Out');
    client.destroy();
});
