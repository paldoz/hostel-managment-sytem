
const { spawn } = require('child_process');
const http = require('http');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    console.log('Starting verification...');

    // 1. Check Rooms GET
    try {
        console.log('Testing GET /rooms...');
        const rooms = await request('GET', '/rooms');
        console.log('✅ GET /rooms success. Count:', rooms.length);
    } catch (e) {
        console.error('❌ GET /rooms failed:', e.message);
        process.exit(1);
    }

    // 2. Add Room
    const testRoom = {
        number: "TEST-" + Date.now(),
        capacity: 4,
        occupied: 0,
        status: "available"
    };
    let createdRoomId;
    try {
        console.log('Testing POST /rooms...');
        const room = await request('POST', '/rooms', testRoom);
        console.log('✅ POST /rooms success:', room);
        createdRoomId = room.number; // Schema uses number as ID for delete
    } catch (e) {
        console.error('❌ POST /rooms failed:', e.message);
        process.exit(1);
    }

    // 3. Add Student
    const testStudent = {
        id: "STU-" + Date.now(), // Frontend sends 'id'
        name: "Test Student",
        phone: "123456789",
        room: createdRoomId,
        feeStatus: "paid",
        joinDate: "2023-01-01",
        email: "test@example.com"
    };
    try {
        console.log('Testing POST /students...');
        const student = await request('POST', '/students', testStudent);
        console.log('✅ POST /students success:', student);
    } catch (e) {
        console.error('❌ POST /students failed:', e.message);
        // Don't exit, try to clean up room
    }

    console.log('Verification Complete!');
}

verify();
