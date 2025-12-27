// Test getting existing announcements
fetch('http://localhost:3000/api/announcements')
    .then(res => res.json())
    .then(data => {
        console.log('GET /api/announcements - SUCCESS');
        console.log('Number of announcements:', data.length);
        console.log('Data:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('GET failed:', err.message);
    });
